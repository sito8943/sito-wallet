import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-lodash-debounce";
import PropTypes from "prop-types";
import { v4 } from "uuid";
import { useTranslation } from "react-i18next";

// @emotion/css
import { css } from "@emotion/css";

// @sito/ui
import { InputControl, Button, Switcher, useStyle } from "@sito/ui";

// providers
import { useUser } from "../../../providers/UserProvider";

// services
import {
  addLog,
  fetchBills,
  fetchFirstLog,
  fetchLog,
  initDay,
  updateLog,
} from "../../../services/wallet";

// components
import Dialog from "../../../components/Dialog/Dialog";
import Counter from "../components/Counter/Counter";

function Header({ setSync }) {
  const { colors } = useStyle();

  const { t } = useTranslation();

  const [showDialog, setShowDialog] = useState(false);
  const hideDialog = () => setShowDialog(false);

  const { userState, setUserState } = useUser();

  const [loadingMoney, setLoadingMoney] = useState(true);

  const [initial, setInitial] = useState(userState.initial ?? 1);
  const debouncedInitial = useDebounce(initial, 500);

  useEffect(() => {
    if (
      debouncedInitial !== null &&
      !isNaN(debouncedInitial) &&
      debouncedInitial !== 1
    ) {
      setSync(true);
      updateLog({ initial: debouncedInitial }).then(({ error }) => {
        if (error && error !== null) console.error(error.message);
        setSync(false);
      });
    }
  }, [debouncedInitial, setSync]);

  const [monthInitial, setMonthInitial] = useState(1);

  useEffect(() => {
    if (userState.account)
      fetchFirstLog(userState.account?.id).then(({ data, error }) => {
        if (error && error !== null) console.error(error.message);
        else {
          const [first] = data;
          if (first) setMonthInitial(first.initial);
        }
      });
  }, [userState.account]);

  const spent = useMemo(() => {
    if (userState.bills) {
      let newSpent = 0;
      userState.bills.forEach((bill) => {
        if (bill.walletBalances.bill) newSpent += Number(bill.spent);
        else newSpent -= Number(bill.spent);
      });
      return newSpent;
    }
    return 0;
  }, [userState.bills]);

  const countLeft = useMemo(() => {
    if (initial) return initial - spent;
    return 1;
  }, [initial, spent]);

  const currentMonth = useMemo(() => {
    return new Date().getMonth();
  }, []);

  const leftDays = useMemo(() => {
    const currentDate = new Date();

    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const days = lastDay.getDate() - currentDate.getDate();

    return days;
  }, []);

  const textDays = useMemo(() => {
    switch (true) {
      case leftDays === 1:
        return `${leftDays} ${t("_accessibility:common.day")}`;
      case leftDays < 1: {
        const now = new Date();

        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        const difference = endOfDay - now;

        const hoursLeft = Math.floor(difference / (1000 * 60 * 60));
        const minutesLeft = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );

        return `${hoursLeft} ${t("_accessibility:common.hours")} ${t(
          "_accessibility:common.and"
        )} ${minutesLeft} ${t("_accessibility:common.minutes")} ${t(
          "_accessibility:common.left"
        )}`;
      }
      default:
        return `${leftDays} ${t("_accessibility:common.days")}`;
    }
  }, [leftDays, t]);

  const severity = useMemo(() => {
    let color = "success";
    if (countLeft > 0 && monthInitial > 0) {
      const percentOfSpent = (countLeft * 100) / monthInitial;

      if (percentOfSpent > 50) color = "success";
      else if (percentOfSpent > 40) color = "warning";
      else color = "bad";
    }
    return css({
      color: colors[color] ? colors[color].default : colors.primary.default,
    });
  }, [countLeft, monthInitial, colors]);

  const currentCurrency = useMemo(() => {
    return "CUP";
  }, []);

  const [lastSavings, setLastSavings] = useState(true);
  const [lastSavingValue, setLastSavingValue] = useState(0);

  const init = async () => {
    setLoadingMoney(true);
    if (!userState.cached) {
      const { data, error } = await fetchLog({
        account: userState.account?.id,
      });

      if (error && error !== null) {
        setLoadingMoney(false);
        return console.error(error.message);
      }
      if (data.length) {
        const { initial } = data[0];
        setInitial(initial);
        setUserState({
          type: "init-log",
          initial,
        });
      } else {
        // fetching and creating previous days
        // updating spent
        let lastInitial = 1;
        const missingDays = [];
        let now = new Date();
        let previousResponse = undefined;
        while (!previousResponse || !previousResponse.data?.length) {
          if (now.getDate() - 1 > 0)
            now = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() - 1
            );
          else {
            const d = new Date(now.getFullYear(), now.getMonth(), 0); // fetching the last day of previous month
            now = new Date(now.getFullYear(), now.getMonth() - 1, d.getDate());
          }
          previousResponse = await fetchLog({
            date: now,
            account: userState.account?.id,
          });
          if (previousResponse.error && previousResponse.error !== null) {
            console.error(previousResponse.error.message);
            setLoadingMoney(false);
          }
          if (!previousResponse.data?.length) {
            const newLogId = v4();
            await addLog({
              id: newLogId,
              created_at: new Date().getTime(),
              year: now.getFullYear(),
              month: now.getMonth(),
              day: now.getDate(),
              account: userState.account?.id,
            });
            missingDays.push({ id: newLogId, date: now });
          } else {
            // found the last day
            let value = previousResponse.data[0].initial;
            // calculating the spent
            const bills = await fetchBills({
              date: now,
              account: userState.account?.id,
            });
            if (bills.error && bills.error !== null) {
              console.error(bills.error.message);
              setLoadingMoney(false);
            }
            bills.data.forEach((bill) => {
              if (bill.walletBalances.bill) value -= bill.spent;
              else value += bill.spent;
            });
            // the last day month is the same of current day
            if (previousResponse.data[0].month !== new Date().getMonth())
              setLastSavingValue(value);
            else lastInitial = value;
          }
        }

        // setting all missing days
        for (const missingLog of missingDays) {
          const { id, date } = missingLog;
          // calculating the spent
          const bills = await fetchBills({
            date,
            account: userState.account?.id,
          });
          if (bills.error && bills.error !== null) {
            console.error(bills.error.message);
            setLoadingMoney(false);
          }
          bills.data.forEach((bill) => {
            if (bill.walletBalances.bill) lastInitial -= bill.spent;
            else lastInitial += bill.spent;
          });
          await updateLog({ id, initial: lastInitial }, date);
        }
        if (lastInitial === 1) setShowDialog(true);
        // creating new day with previous money
        if (
          localStorage.getItem("initializing") !== `${new Date().getDate()}`
        ) {
          localStorage.setItem("initializing", `${new Date().getDate()}`);
          const response = await initDay(userState.account?.id, lastInitial);
          if (response.error && response.error !== null)
            console.error(response.error.message);
        }
        setInitial(lastInitial);
        setUserState({ type: "init-log", initial: lastInitial });
      }
    }
    setLoadingMoney(false);
  };

  const onSubmitDialog = async (e) => {
    e.preventDefault();
    const { error } = await updateLog({
      initial: lastSavings ? lastSavingValue : initial,
    });
    setUserState({
      type: "init-log",
      initial: lastSavings ? lastSavingValue : initial,
    });
    if (lastSavings) setInitial(lastSavingValue);
    console.error(error?.message);
    hideDialog();
  };

  useEffect(() => {
    init();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSync]);

  return (
    <section className="flex flex-col gap-3">
      <Dialog visible={showDialog} onClose={hideDialog} canBeClosed={false}>
        <form
          onSubmit={onSubmitDialog}
          className="bg-light-default dark:bg-dark-default p-5 rounded-sm flex flex-col items-start justify-start gap-4"
        >
          <InputControl
            id="initial"
            label={t("_pages:dialog.initialCount")}
            value={lastSavings ? lastSavingValue : initial}
            type="number"
            disabled={lastSavings}
            className="text-right primary"
            onChange={(e) => setInitial(e.target.value)}
          />
          <Switcher
            value={lastSavings}
            onChange={() => setLastSavings((lastSavings) => !lastSavings)}
            label={t("_home.dialog.takeLastMonth")}
          />
          <Button
            type="submit"
            shape="filled"
            color="primary"
            aria-label={t("_pages:home.dialog.acceptToStart")}
            name="set-initial"
          >
            {t("_accessibility:buttons.accept")}
          </Button>
        </form>
      </Dialog>
      <div className="flex w-full items-end justify-between">
        {!loadingMoney ? (
          <>
            <h2
              className={`text-8xl md:text-7xl sm:text-6xl xs:text-4xl ${severity} flex`}
            >
              <span className={`${severity} opacity-40 mr-2`}>$</span>
              <Counter number={countLeft} className={severity} />
            </h2>
            <p className="text-3xl xs:text-xl primary">{currentCurrency}</p>
          </>
        ) : (
          <div className="w-full h-[72px] skeleton-box" />
        )}
      </div>
      <hr className="w-full border-[1px]" />
      {!loadingMoney ? (
        <p className="text-xl xs:text-[16px]">
          {t("_pages:home.header.left")}{" "}
          {t(`_accessibility:months.${currentMonth}`)}.{" "}
          {t("_pages:home.header.for")} {textDays}
        </p>
      ) : (
        <div className="w-full h-[28px] skeleton-box" />
      )}
    </section>
  );
}

Header.propTypes = {
  setSync: PropTypes.func,
};

export default Header;
