import { useCallback, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { v4 } from "uuid";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { useNotification, SelectControl, IconButton } from "@sito/ui";

// providers
import { useUser } from "../../providers/UserProvider";

// components
import Syncing from "../../components/Syncing/Syncing";

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
import { groupBills } from "../../utils/parsers";

function AllLogs() {
  const { t } = useTranslation();

  const { userState, setUserState } = useUser();

  const addButton = useRef();

  const { setNotification } = useNotification();
  const [sync, setSync] = useState(true);

  const [balanceType, setBalanceType] = useState(0);

  const onChangeBalanceType = (e) => {
    console.log(e);
  };

  const extraBalances = ["all", "bills", "incomings"];
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
        // setting
        setUserState({
          type: "init-balances",
          balances: remoteBalances.data,
        });
      }
    }
  };

  const localFetchLogs = async () => {
    const { data, error } = await fetchLogs();
    console.log(groupBills(data));
    setLogs(groupBills(data));
    setSync(false);
  };

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

  return (
    <main>
      <div className="p-10 sm:p-3 pt-20 mt-20 flex flex-col gap-5 justify-start items-start flex-1">
        <div
          className={`w-10 h-10 fixed bottom-1 left-1 transition-all duration-300 ease-in-out ${
            sync ? "scale-100" : "scale-0"
          } pointer-events-none primary filled rounded-full`}
        >
          <Syncing />
        </div>
        <div className="flex items-center gap-1">
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
        <ul className="h-full w-full">
          {sync
            ? [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <li key={item}>
                  <div className="w-full h-[44px] skeleton-box" />
                </li>
              ))
            : Object.keys(logs).map((year) => (
                <li key={year} className="appear">
                  <p className="text-4xl poppins">{year}</p>
                  <ul>
                    {Object.keys(logs[year]).map((month) => (
                      <li key={`${year}-${month}`}>
                        <p className="text-3xl my-2">
                          {t(`_accessibility:months.${month}`)}
                        </p>
                        <ul>
                          {Object.keys(logs[year][month]).map((day) => (
                            <li key={`${year}-${month}-${day}`}>
                              <p className="text-2xl ">{day}</p>
                              <ul>
                                {logs[year][month][day]
                                  .filter((bill) => !bill.deleted)
                                  .map((bill) => (
                                    <li key={bill.id} className="appear">
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
                                          const newBills = [...userState.bills];
                                          if (!userState.cached) {
                                            const { error } = await deleteBill(
                                              bill.id
                                            );

                                            newBills.splice(
                                              newBills.findIndex(
                                                (billR) => billR.id === bill.id
                                              ),
                                              1
                                            );

                                            if (error && error !== null)
                                              console.error(error.message);
                                          } else
                                            newBills[
                                              newBills.findIndex(
                                                (billR) => billR.id === bill.id
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

      <IconButton
        aria-label={t("_pages.home.bills.addBill")}
        tooltip={t("_pages.home.bills.addBill")}
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
        icon={faAdd}
        className={`aGrow fixed bottom-3 right-3 scale-100 transition duration-300 ease-in-out`}
      />
    </main>
  );
}

export default AllLogs;
