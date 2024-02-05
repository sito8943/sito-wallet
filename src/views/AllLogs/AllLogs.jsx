import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import stringSimilarity from "string-similarity";
import { v4 } from "uuid";
import Tippy from "@tippyjs/react";
import { sortBy } from "some-javascript-utils/array";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faChevronUp } from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { useNotification, IconButton, Button } from "@sito/ui";

// providers
import { useUser } from "../../providers/UserProvider";

// components
import Syncing from "../../components/Syncing/Syncing";

// utils
import { groupBills } from "../../utils/parsers";

// services
import {
  fetchBalances,
  addBalance,
  addBill as addRemoteBill,
  deleteBill,
  updateBill,
  fetchBills,
} from "../../services/wallet";
import { fetchLogs } from "../../services/utils";

// components
import Bill from "../Home/components/Bill/Bill";
import Header from "./components/Header";
import Filters from "./components/Filters";

// styles
import "./styles.css";
import { scrollTo } from "some-javascript-utils/browser";

function AllLogs() {
  const { t } = useTranslation();

  const { userState, setUserState } = useUser();

  const addButton = useRef();

  const { setNotification } = useNotification();
  const [sync, setSync] = useState(true);

  const [showFilter, setShowFilter] = useState(false);
  const [billBalances, setBillBalances] = useState([]);
  const [incomingBalances, setIncomingBalances] = useState([]);
  const [balanceType, setBalanceType] = useState(0);
  const [years, setYears] = useState([]);
  const [year, setYear] = useState(-1);
  const [month, setMonth] = useState(-1);
  const [searchValue, setSearchValue] = useState("");

  const onChangeBalanceType = (value) => {
    setBalanceType(value);
  };

  const [logs, setLogs] = useState([]);

  const [asc, setAsc] = useState(false);

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
        setBillBalances(
          remoteBalances.data
            .filter((balanceType) => balanceType.bill)
            .map((balanceType) => balanceType.id)
        );
        setIncomingBalances(
          remoteBalances.data
            .filter((balanceType) => !balanceType.bill)
            .map((balanceType) => balanceType.id)
        );
        // setting
        setUserState({
          type: "init-balances",
          balances: remoteBalances.data,
        });
      }
    }
  };

  const localFetchLogs = useCallback(async () => {
    const { data, error } = await fetchLogs();
    for (let i = 0; i < data.length; i += 1) {
      if (billBalances.indexOf(data[i].balanceType) >= 0) data[i].bill = true;
      else data[i].bill = false;
    }
    const grouped = groupBills(data);
    setLogs(grouped);
    setYears(Object.keys(grouped));
    setSync(false);
  }, [billBalances, incomingBalances]);

  const addBill = async () => {
    const bills = [...userState.bills];
    const newBill = {
      id: v4(),
      description: "Nuevo gasto",
      spent: 0,
      created_at: new Date().getTime(),
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date().getDate(),
      balanceType: userState.balances[0].id,
      account: userState.account?.id,
    };
    if (!userState.cached) {
      const { data, error } = await addRemoteBill(newBill);
      if (error && error !== null) console.error(error.message);
      else if (data.length) bills.push(data[0]);
    } else {
      if (userState.balances) {
        newBill.walletBalances = userState.balances.find(
          (balance) => balance.id === newBill.balanceType
        );
        bills.push(newBill);
      }
    }
    setUserState({ type: "add-bill", bills });
    return newBill.id;
  };

  useEffect(() => {
    localFetchBalanceTypes();
    localFetchLogs();
  }, []);

  const handleBillDescription = useCallback((bill) => {}, []);

  const handleBillSpent = useCallback((bill) => {}, []);

  const handleBillBalanceType = useCallback((bill) => {}, []);

  const [orderBy, setOrderBy] = useState(true);
  const [sticky, setSticky] = useState(true);

  const onScroll = useCallback(() => {
    const top = window.pageYOffset || document.documentElement.scrollTop;
    setSticky(top > 200);
  }, [setSticky]);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  const sortedLogs = useMemo(() => {
    let sorted = [];
    if (!orderBy) sorted = Object.keys(logs);
    if (orderBy === true) sorted = Object.keys(logs).reverse();
    //TODO Variables orders
    return sorted;
  }, [logs, orderBy]);

  const applySearchFilter = (bill, searchLoweredValue) =>
    searchLoweredValue.length
      ? stringSimilarity.compareTwoStrings(
          bill.description.toLowerCase(),
          searchLoweredValue
        ) > 0.5
      : true;

  const applyBalanceTypeFilter = useCallback(
    (bill) => {
      if (!bill.deleted) {
        if (Number(balanceType) === 0) return true;
        if (Number(balanceType) === 1 && bill.bill) return true;
        if (Number(balanceType) === 2 && !bill.bill) return true;
        else if (balanceType === bill.balanceType) return true;
      }
      return false;
    },
    [balanceType]
  );

  const printLogs = useCallback(
    (localLogs) => {
      const searchLoweredValue = searchValue.toLowerCase();
      const logsToPrint = [];
      localLogs.forEach((bill) => {
        if (
          applySearchFilter(bill, searchLoweredValue) &&
          applyBalanceTypeFilter(bill)
        )
          logsToPrint.push(bill);
      });
      return logsToPrint;
    },
    [searchValue, applyBalanceTypeFilter]
  );

  return (
    <main>
      <div className="p-10 sm:p-3 pt-20 mt-20 flex flex-col gap-2 justify-start items-start flex-1">
        <div
          className={`w-10 h-10 fixed bottom-1 left-1 transition-all duration-300 ease-in-out ${
            sync ? "scale-100" : "scale-0"
          } pointer-events-none primary filled rounded-full`}
        >
          <Syncing />
        </div>

        <Header
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          balanceType={balanceType}
          onChangeBalanceType={onChangeBalanceType}
        />
        <Filters
          year={year}
          years={years}
          setYear={setYear}
          month={month}
          setMonth={setMonth}
          showFilter={showFilter}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <ul className="h-full w-full appear">
          {sync
            ? [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <li key={item}>
                  <div className="w-full h-[44px] skeleton-box" />
                </li>
              ))
            : sortedLogs.map((year) => (
                <li key={year}>
                  <p className="text-4xl poppins">{year}</p>
                  <ul>
                    {Object.keys(logs[year])
                      .reverse()
                      .map((month) => (
                        <li key={`${year}-${month}`}>
                          <p className="text-3xl my-2">
                            {t(`_accessibility:months.${month}`)}
                          </p>
                          <ul>
                            {Object.keys(logs[year][month])
                              .reverse()
                              .map((day) => (
                                <li key={`${year}-${month}-${day}`}>
                                  <p className="text-2xl ">
                                    {t("_accessibility:day")} {day}
                                  </p>
                                  <ul>
                                    {printLogs(
                                      logs[year][month][day].reverse()
                                    ).map((bill) => (
                                      <li key={bill.id}>
                                        <Bill
                                          {...bill}
                                          onChangeDescription={(value) => {
                                            /* setSync(true);
                                          handleBillDescription({
                                            value,
                                            id: bill.id,
                                          }); */
                                          }}
                                          onChangeSpent={(value) => {
                                            /*  setSync(true);
                                          handleBillSpent({
                                            value,
                                            id: bill.id,
                                          }); */
                                          }}
                                          onChangeBalanceType={(value) => {
                                            /* setSync(true);

                                          handleBillBalanceType({
                                            value,
                                            id: bill.id,
                                          }); */
                                          }}
                                          onDelete={async () => {
                                            /* setSync(true); */
                                            const newBills = [
                                              ...userState.bills,
                                            ];
                                            if (!userState.cached) {
                                              const { error } =
                                                await deleteBill(bill.id);

                                              newBills.splice(
                                                newBills.findIndex(
                                                  (billR) =>
                                                    billR.id === bill.id
                                                ),
                                                1
                                              );

                                              if (error && error !== null)
                                                console.error(error.message);
                                            } else
                                              newBills[
                                                newBills.findIndex(
                                                  (billR) =>
                                                    billR.id === bill.id
                                                )
                                              ].deleted = true;

                                            setUserState({
                                              type: "init-bills",
                                              bills: newBills,
                                            });
                                            setSync(false);
                                          }}
                                        />
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              ))}
                          </ul>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
        </ul>
      </div>
      <Button onClick={() => scrollTo(0, 0)} className="w-full rounded-none">
        <FontAwesomeIcon icon={faChevronUp} />
      </Button>
      <Tippy content={t("_pages.home.bills.addBill")}>
        <IconButton
          aria-label={t("_pages.home.bills.addBill")}
          name="floating-add-bill"
          onClick={async () => {
            const id = await addBill();
            setTimeout(
              () => scrollTo(document.getElementById(id).offsetTop),
              200
            );
          }}
          color="secondary"
          shape="filled"
          icon={<FontAwesomeIcon icon={faAdd} />}
          className={`aGrow fixed bottom-3 right-3 scale-100 transition duration-300 ease-in-out`}
        />
      </Tippy>
    </main>
  );
}

export default AllLogs;
