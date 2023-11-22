import { useRef, useEffect, useState, useCallback } from "react";
import { useInViewport } from "react-in-viewport";
import { v4 } from "uuid";
import PropTypes from "prop-types";
import { sortBy } from "some-javascript-utils/array";
import { scrollTo } from "some-javascript-utils/browser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faSmile,
  faSortAmountDown,
  faSortAmountUp,
} from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { IconButton } from "@sito/ui";

// services
import {
  addBill as addRemoteBill,
  deleteBill,
  updateBill,
  fetchBills,
  fetchBalances,
  addBalance,
} from "../../../services/wallet";

// providers
import { useUser } from "../../../providers/UserProvider";

// components
import Bill from "../components/Bill/Bill";

function Bills({ setSync }) {
  const { userState, setUserState } = useUser();

  const [loadingBills, setLoadingBills] = useState(true);

  const addButton = useRef();
  const { inViewport } = useInViewport(addButton);

  const [asc, setAsc] = useState(false);

  const [toUpdate, setToUpdate] = useState({});

  const updateLocalBill = async (bill) => {
    const bills = userState.bills;
    const index = bills.findIndex((b) => b.id === bill.id);
    if (index >= 0) {
      if (bill.description) {
        bill.description = bill.value;
        bills[index].description = bill.value;
      }
      if (bill.spent) {
        bill.spent = bill.value;
        bills[index].spent = bill.value;
      }
      if (bill.balanceType) {
        bill.balanceType = bill.value;
        bills[index].balanceType = bill.value;
      }
      delete bill.value;
      if (!userState.cached) {
        const { data, error } = await updateBill(bill);
        if (error && error !== null) {
          setSync(false);
          return console.error(error.message);
        }
        if (data.length) bills[index] = data[0];
      } else {
        // loading local walletBalance
        if (userState.balances)
          bill[index].walletBalances = userState.balances.find(
            (balance) => balance.id === bills[index].balanceType
          );
      }
      setUserState({ type: "init-bills", bills: [...bills] });
    }

    setSync(false);
  };

  useEffect(() => {
    if (Object.keys(toUpdate).length) updateLocalBill(toUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toUpdate]);

  const handleBillDescription = useCallback(
    (bill) => setToUpdate({ ...bill, description: true }),
    []
  );

  const handleBillSpent = useCallback(
    (bill) => setToUpdate({ ...bill, spent: true }),
    []
  );

  const handleBillBalanceType = useCallback(
    (bill) => setToUpdate({ ...bill, balanceType: true }),
    []
  );

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

  const init = async () => {
    setLoadingBills(true);
    if (!userState.cached) {
      const { data, error } = await fetchBills();
      if (error && error !== null) {
        setLoadingBills(false);
        return console.error(error.message);
      }

      if (!data.length) {
        setUserState({
          type: "init-bills",
          bills: [],
        });
      }
    }
    setLoadingBills(false);
  };

  const initBalancesType = async () => {
    if (!userState.balances) {
      const remoteBalances = await fetchBalances();
      if (remoteBalances.error && remoteBalances.error !== null)
        return console.error(remoteBalances.error.message);

      if (
        !remoteBalances.length &&
        localStorage.getItem("basic-balance") === null
      ) {
        localStorage.setItem("basic-balance", "Gastos básicos");
        const newBalance = {
          id: v4(),
          description: "Gastos básicos",
          bill: true,
          created_at: new Date().getTime(),
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
    if (!userState.balances) initBalancesType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState.balances]);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="flex flex-col gap-3">
      <div className="w-full flex items-center justify-between">
        <h3 className="text-3xl xs:text-xl">Balance actual</h3>
        <div className="flex gap-3 items-center">
          <IconButton
            name="filter"
            tooltip="Ordenar gastos"
            aria-label="Ordenar gastos"
            onClick={() => setAsc((asc) => !asc)}
            icon={asc ? faSortAmountUp : faSortAmountDown}
          />
          <IconButton
            ref={addButton}
            aria-label="Agregar gasto"
            tooltip="Agregar gasto"
            name="add-bill"
            onClick={addBill}
            icon={faAdd}
          />
        </div>
      </div>
      <ul>
        {loadingBills ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <li key={item}>
              <div className="w-full h-[44px] skeleton-box" />
            </li>
          ))
        ) : (
          <>
            {userState.bills && userState.bills.length ? (
              sortBy(userState.bills ?? [], "spent", !asc)
                .filter((bill) => !bill.deleted)
                .map((bill) => {
                  return (
                    <li key={bill.id} className="appear">
                      <Bill
                        {...bill}
                        onChangeDescription={(value) => {
                          setSync(true);
                          handleBillDescription({ value, id: bill.id });
                        }}
                        onChangeSpent={(value) => {
                          setSync(true);
                          handleBillSpent({ value, id: bill.id });
                        }}
                        onChangeBalanceType={(value) => {
                          setSync(true);

                          handleBillBalanceType({ value, id: bill.id });
                        }}
                        onDelete={async () => {
                          setSync(true);
                          if (!userState.cached) {
                            const { error } = await deleteBill(bill.id);

                            const newBills = [...userState.bills];
                            newBills.splice(
                              newBills.findIndex(
                                (billR) => billR.id === bill.id
                              ),
                              1
                            );
                            setUserState({
                              type: "init-bills",
                              bills: newBills,
                            });
                            if (error && error !== null)
                              console.error(error.message);
                          } else {
                            const newBills = [...userState.bills];
                            newBills[
                              newBills.findIndex(
                                (billR) => billR.id === bill.id
                              )
                            ].deleted = true;
                            setUserState({
                              type: "init-bills",
                              bills: newBills,
                            });
                          }
                          setSync(false);
                        }}
                      />
                    </li>
                  );
                })
            ) : (
              <li>
                <p className="text-secondary-400 dark:text-secondary-default">
                  ¿Ningún balance? Vamos bien{" "}
                  <FontAwesomeIcon className="ternary" icon={faSmile} />
                </p>
              </li>
            )}
          </>
        )}
      </ul>
      <IconButton
        aria-label="Agregar gasto"
        tooltip="Agregar gasto"
        name="floating-add-bill"
        onClick={async () => {
          const id = await addBill();
          setTimeout(
            () => scrollTo(document.getElementById(id).offsetTop),
            200
          );
        }}
        color="secondary submit"
        icon={faAdd}
        className={`aGrow fixed bottom-3 right-3 ${
          inViewport ? "scale-0 pointer-events-none" : "scale-100"
        } transition duration-300 ease-in-out`}
      />
    </section>
  );
}

Bills.propTypes = {
  setSync: PropTypes.func,
};

export default Bills;
