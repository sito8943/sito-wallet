import { useMemo, useState, useEffect, useCallback } from "react";
import { v4 } from "uuid";
import { sortBy } from "some-javascript-utils/array";
import PropTypes from "prop-types";

import {
  faAdd,
  faArrowDownAZ,
  faArrowUpAZ,
} from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { IconButton } from "@sito/ui";

// providers
import { useUser } from "../../../providers/UserProvider";

// services
import {
  updateBalance,
  deleteBalance,
  fetchBalances,
  addBalance as addRemoteBalance,
} from "../../../services/wallet";

// components
import Balance from "../components/Balance/Balance";

function BalanceTypes({ setSync }) {
  const { userState, setUserState } = useUser();

  const [loadingBalances, setLoadingBalances] = useState(true);

  const [asc, setAsc] = useState(false);

  const [toUpdate, setToUpdate] = useState({});

  const updateLocalBalance = async (balance) => {
    const balances = [...userState.balances];
    const index = balances.findIndex((b) => b.id === balance.id);
    if (index >= 0) {
      if (balance.description) balances[index].description = balance.value;
      if (balance.bill) balances[index].bill = balance.value;
      delete balance.value;
      const { error } = await updateBalance(balances[index]);
      if (error && error !== null) {
        setSync(false);
        return console.error(error.message);
      }

      setUserState({ type: "init-balances", balances });
    }

    setSync(false);
  };

  useEffect(() => {
    if (Object.keys(toUpdate).length) updateLocalBalance(toUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toUpdate]);

  const handleBalanceDescription = useCallback(
    (balance) => setToUpdate({ ...balance, description: true }),
    []
  );

  const handleBalanceBill = useCallback(
    (balance) => setToUpdate({ ...balance, spent: true }),
    []
  );

  const printBalances = useMemo(() => {
    const balances = userState.balances;
    if (loadingBalances) {
      return [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <li key={item}>
          <div className="w-full h-[44px] skeleton-box" />
        </li>
      ));
    }

    if (balances)
      return sortBy(balances, "description", asc).map((balance) => {
        return (
          <li key={balance.id} className="appear">
            <Balance
              {...balance}
              onChangeDescription={(value) => {
                setSync(true);
                handleBalanceDescription({ value, id: balance.id });
              }}
              onChangeSpent={(value) => {
                setSync(true);
                handleBalanceBill({ value, id: balance.id });
              }}
              onDelete={async () => {
                setSync(true);
                const { error } = await deleteBalance(balance.id);
                const newBalances = [...balances];
                newBalances.splice(
                  newBalances.findIndex(
                    (balanceR) => balanceR.id === balance.id
                  ),
                  1
                );
                setUserState({ type: "init-balances", balances: newBalances });
                if (error && error !== null) console.error(error.message);
                setSync(false);
              }}
            />
          </li>
        );
      });
    return <></>;
  }, [
    setSync,
    loadingBalances,
    userState.balances,
    asc,
    handleBalanceDescription,
    handleBalanceBill,
    setUserState,
  ]);

  const addBalance = async () => {
    const newBalance = {
      id: v4(),
      description: "Nuevo balance",
      bill: true,
      created_at: new Date().getTime(),
    };
    const { error } = await addRemoteBalance(newBalance);
    if (error && error !== null) console.error(error.message);
    else
      setUserState({
        type: "init-balances",
        balances: [...userState.balances, newBalance],
      });
    return newBalance.id;
  };

  const init = async () => {
    setLoadingBalances(true);

    const { data, error } = await fetchBalances();
    if (error && error !== null) {
      setLoadingBalances(false);
      return console.error(error.message);
    }
    if (!data.length && localStorage.getItem("basic-balance") === null) {
      const basicBalance = {
        id: v4(),
        created_at: new Date().getTime(),
        description: "Gastos básicos",
        bill: true,
      };
      localStorage.setItem("basic-balance", "Gastos básicos");
      const insertBasic = await addRemoteBalance(basicBalance);
      if (insertBasic.error && insertBasic.error !== null)
        console.error(insertBasic.error.message);
      setUserState({
        type: "init-balances",
        balances: [basicBalance],
      });
    } else {
      const responseBalances = await fetchBalances();
      if (responseBalances.error && responseBalances.error !== null) {
        setLoadingBalances(false);
        return console.error(responseBalances.error.message);
      }
      // setting
      setUserState({
        type: "init-balances",
        balances: responseBalances.data,
      });
    }

    setLoadingBalances(false);
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <div className="w-full flex items-center justify-between">
        <h3 className="text-xl">Mis tipos de balances</h3>
        <div className="flex gap-3 items-center">
          <IconButton
            name="filter"
            tooltip="Ordenar tipos de balance"
            aria-label="Ordenar tipos de balance"
            onClick={() => setAsc((asc) => !asc)}
            icon={asc ? faArrowDownAZ : faArrowUpAZ}
          />
          <IconButton
            aria-label="Agregar tipo de balance"
            tooltip="Agregar tipo de balance"
            name="add-balance"
            onClick={addBalance}
            icon={faAdd}
          />
        </div>
      </div>
      <ul>{printBalances}</ul>
    </section>
  );
}

BalanceTypes.propTypes = {
  setSync: PropTypes.func,
};

export default BalanceTypes;
