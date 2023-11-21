import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-lodash-debounce";
import PropTypes from "prop-types";

// @sito/ui
import { InputControl, Button } from "@sito/ui";

// providers
import { useUser } from "../../../providers/UserProvider";

// services
import {
  fetchBills,
  fetchFirstLog,
  fetchLog,
  initDay,
  updateLog,
} from "../../../services/wallet";

// components
import Dialog from "../../../components/Dialog/Dialog";
import Counter from "../components/Counter/Counter";

// styles
import "./styles.css";

function Header({ setSync }) {
  const [showDialog, setShowDialog] = useState(false);
  const hideDialog = () => setShowDialog(false);

  const { userState, setUserState } = useUser();

  const [loadingMoney, setLoadingMoney] = useState(true);

  const [initial, setInitial] = useState(1);
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
    fetchFirstLog().then(({ data, error }) => {
      if (error && error !== null) console.error(error.message);
      else {
        const [first] = data;
        if (first) setMonthInitial(first.initial);
      }
    });
  }, []);

  const spent = useMemo(() => {
    if (userState.bills) {
      let newSpent = 0;
      userState.bills.forEach((bill) => {
        newSpent += Number(bill.spent);
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
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const now = new Date().getMonth();
    return months[now];
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

  const severity = useMemo(() => {
    if (countLeft > 0 && monthInitial > 0) {
      const percentOfSpent = (countLeft * 100) / monthInitial;

      if (percentOfSpent > 50) return "good";
      else if (percentOfSpent > 40) return "alert";
      else return "bad";
    }
    return "good";
  }, [countLeft, monthInitial]);

  const currentCurrency = useMemo(() => {
    return "CUP";
  }, []);

  const init = async () => {
    setLoadingMoney(true);
    const { data, error } = await fetchLog();

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
      // fetching previous day
      let now = new Date();
      let previousResponse = undefined;
      if (now.getDate() - 1 > 0) {
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        previousResponse = await fetchLog(now);
      } else {
        const d = new Date(now.getFullYear(), now.getMonth() - 1, 0); // fetching the last day of previous month
        now = new Date(now.getFullYear(), now.getMonth() - 1, d.getDate());
        previousResponse = await fetchLog(now);
      }
      // updating spent
      let toInit = 1;
      if (previousResponse && previousResponse.data?.length) {
        if (previousResponse.error && previousResponse.error !== null) {
          console.error(bills.error.message);
          setLoadingMoney(false);
        }
        const [previous] = previousResponse.data;
        const bills = await fetchBills(now);
        if (bills.error && bills.error !== null) {
          console.error(bills.error.message);
          setLoadingMoney(false);
        }
        let previousSpent = 0;
        bills.data.forEach((bill) => {
          previousSpent += bill.spent;
        });
        toInit = previous.initial - previousSpent;
      } else setShowDialog(true);
      // creating new day with previous money
      if (localStorage.getItem("initializing") !== `${new Date().getDate()}`) {
        localStorage.setItem("initializing", `${new Date().getDate()}`);
        const response = await initDay(toInit);
        if (response.error && response.error !== null)
          console.error(response.error.message);
      }
      setInitial(toInit);
      setUserState({ type: "init-log", initial: toInit });
    }
    setLoadingMoney(false);
  };

  const onSubmitDialog = async (e) => {
    e.preventDefault();
    const { error } = await updateLog({ initial });
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
            label="Cantidad inicial de este mes"
            value={initial}
            type="number"
            className="text-right"
            onChange={(e) => setInitial(e.target.value)}
          />
          <Button type="submit" className="submit primary">
            Aceptar
          </Button>
        </form>
      </Dialog>
      <div className="flex w-full items-end justify-between">
        {!loadingMoney ? (
          <>
            <h2
              className={`text-8xl md:text-7xl sm:text-6xl xs:text-5xl ${severity} flex`}
            >
              <span className="text-primary-default opacity-40 mr-2">$</span>
              <Counter number={countLeft} className={severity} />
            </h2>
            <p className="primary text-3xl xs:text-xl text-primary-default">
              {currentCurrency}
            </p>
          </>
        ) : (
          <div className="w-full h-[72px] skeleton-box" />
        )}
      </div>
      <hr className="w-full border-2 text-primary-default" />
      {!loadingMoney ? (
        <p className="text-primary-default text-xl xs:text-[16px]">
          Quedan en {currentMonth}. Por {leftDays} días
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
