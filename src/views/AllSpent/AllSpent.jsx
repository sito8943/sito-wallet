import { useMemo, useCallback, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { v4 } from "uuid";

// @sito/ui
import { useNotification, Button, SelectControl } from "@sito/ui";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

// providers
import { useUser } from "../../providers/UserProvider";

// utils
import {
  toCamelCase,
  groupByYearAndMonth,
  getMaxTotalSpent,
} from "../../utils/parsers";

// components
import Syncing from "../../components/Syncing/Syncing";
import Bar from "./components/Bar";

// services
import { fetchBalances, addBalance } from "../../services/wallet";
import { fetchYears, fetchSpentByMonthNdYear } from "../../services/utils";

// styles
import "./styles.css";

export default function AllSpent() {
  const { t } = useTranslation();

  const { userState, setUserState } = useUser();
  const [balanceType, setBalanceType] = useState(1);
  const extraBalances = ["bills", "incomings"];

  const onChangeBalanceType = (e) => {
    console.log(e);
  };

  const logsRef = useRef(null);

  const { setNotification } = useNotification();

  const currentMonth = useMemo(() => new Date().getMonth(), []);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const [sync, setSync] = useState(true);
  const [years, setYears] = useState([]);
  const [columns, setColumns] = useState([]);
  const [max, setMax] = useState(0);

  const localFetchYears = useCallback(async () => {
    const { data, error } = await fetchYears();
    if (error !== null && error.message)
      setNotification({
        type: "error",
        message: t(`_accessibility:errors.${toCamelCase(error.message)}`),
      });

    const yearsSet = new Set(data.map((t) => t.year));
    setYears(Array.from(yearsSet));
    setTimeout(() => setSync(false), 300);
  }, [setNotification, t]);

  const localFetchSpentByMonthNdYear = useCallback(async () => {
    // if 1 or 0 bills or incoming simple query
    // if any balance type send balanceType id
    // prepare rpc with params
    const { data, error } = await fetchSpentByMonthNdYear();
    if (error !== null && error.message)
      setNotification({
        type: "error",
        message: t(`_accessibility:errors.${toCamelCase(error.message)}`),
      });
    setColumns(groupByYearAndMonth(data));
    setMax(getMaxTotalSpent(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setNotification, t, balanceType]);

  const localFetchBalanceTypes = async () => {
    if (!userState.balances) {
      const remoteBalances = await fetchBalances();
      if (remoteBalances.error && remoteBalances.error !== null)
        return console.error(remoteBalances.error.message);

      if (
        !remoteBalances.data.length &&
        localStorage.getItem("basic-balance") === null
      ) {
        localStorage.setItem(
          "basic-balance",
          t("_accessibility:defaultValues.balanceTypes")
        );
        const newBalance = {
          id: v4(),
          description: t("_accessibility:defaultValues.balanceTypes"),
          bill: true,
          created_at: new Date().getTime(),
          account: userState.account?.id,
        };
        if (!userState.cached) {
          const { error } = await addBalance(newBalance);
          if (error && error !== null) console.error(error.message);
        }
        setUserState({
          type: "init-balances",
          balances: [...(userState.balances ?? []), newBalance],
        });
      } else {
        // setting
        setUserState({
          type: "init-balances",
          balances: remoteBalances.data,
        });
      }
    }
  };

  useEffect(() => {
    localFetchYears();
    localFetchSpentByMonthNdYear();
    localFetchBalanceTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (years.length && !sync)
      setTimeout(() => {
        logsRef?.current?.scroll({
          top: 0,
          left:
            document.getElementById(`${currentYear}-${currentMonth}`)
              ?.offsetLeft - 100,
          behavior: "smooth",
        });
      }, 500);
  }, [sync, years, logsRef, currentMonth, currentYear]);

  return (
    <main>
      <div className="p-10 sm:p-3 pt-20 mt-20 flex flex-col gap-10 justify-start items-start flex-1">
        <div
          className={`w-10 h-10 fixed bottom-1 left-1 transition-all duration-300 ease-in-out ${
            sync ? "scale-100" : "scale-0"
          } pointer-events-none primary filled rounded-full`}
        >
          <Syncing />
        </div>
      </div>

      <div className="flex items-center ml-1 gap-1">
        <Link
          to="/"
          name="to-home"
          aria-label={`${t("_accessibility:ariaLabels.goTo")} ${t(
            "_pages:routes.home"
          )}`}
          className="button icon-button primary"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Link>
        <div className="flex flex-col items-start justify-start">
          <h2 className="text-6xl md:text-5xl sm:text-4xl xs:text-3xl">
            {t("_pages:allSpent.title")}
          </h2>
          <SelectControl
            value={balanceType}
            onChange={(e) => onChangeBalanceType(e.target.value)}
            className={`text-sm no-bg !pl-0`}
          >
            {extraBalances.map((extra) => (
              <option
                key={t(`_pages:allSpent.extraBalances.${extra}.id`)}
                value={t(`_pages:allSpent.extraBalances.${extra}.id`)}
              >
                {t(`_pages:allSpent.extraBalances.${extra}.description`)}
              </option>
            ))}
            {userState.balances?.map((balance) => (
              <option key={balance.id} value={balance.id}>
                {balance.description}
              </option>
            ))}
          </SelectControl>
        </div>
      </div>

      <div ref={logsRef} className="logs flex overflow-auto py-3 px-10 sm:px-3">
        {years.map((year) => (
          <div key={year} className="year-column flex flex-col gap-2 appear">
            <h3>{year}</h3>
            <div className="months-row flex items-start justify-start">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => (
                <div
                  key={month}
                  className="flex flex-col gap-2 h-[345px] justify-between"
                >
                  <Button
                    id={`${year}-${month}`}
                    color={
                      currentMonth === month && currentYear === year
                        ? "primary"
                        : "basics"
                    }
                    shape="outlined"
                    className={`button rounded-none`}
                  >
                    {t(`_accessibility:monthsReduced.${month}`)}
                  </Button>
                  <Bar
                    max={max}
                    active={currentMonth === month && currentYear === year}
                    value={columns[year] ? columns[year][month] : 0}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
