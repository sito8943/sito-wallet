import { useMemo, useState, useEffect, useCallback } from "react";
import { v4 } from "uuid";
import { sortBy } from "some-javascript-utils/array";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import Tippy from "@tippyjs/react";

function BalanceTypes({ setSync }) {
  const { t } = useTranslation();

  const { userState, setUserState } = useUser();

  const [loadingBalances, setLoadingBalances] = useState(true);

  const [asc, setAsc] = useState(false);

  const [toUpdate, setToUpdate] = useState({});
  const [balanceCreated, setBalanceCreated] = useState(false);

  const updateLocalBalance = async (balance) => {
    const balances = [...userState.balances];
    const index = balances.findIndex((b) => b.id === balance.id);
    if (index >= 0) {
      if (balance.description) balances[index].description = balance.value;
      if (balance.bill) balances[index].bill = balance.value;
      delete balance.value;
      if (!userState.cached) {
        const { data, error } = await updateBalance(balances[index]);
        if (error && error !== null) {
          setSync(false);
          return console.error(error.message);
        }
        if (data.length) balances[index] = data[0];
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
    (balance) => setToUpdate({ ...balance, bill: true }),
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
              onChangeBill={() => {
                setSync(true);
                handleBalanceBill({ value: !balance.bill, id: balance.id });
              }}
              onDelete={async () => {
                setSync(true);
                const newBalances = [...balances];
                if (!userState.cached) {
                  const { error } = await deleteBalance(balance.id);

                  newBalances.splice(
                    newBalances.findIndex(
                      (balanceR) => balanceR.id === balance.id
                    ),
                    1
                  );

                  if (error && error !== null) console.error(error.message);
                } else {
                  newBalances[
                    newBalances.findIndex(
                      (balanceR) => balanceR.id === balance.id
                    )
                  ].deleted = true;
                }
                setUserState({
                  type: "init-balances",
                  balances: newBalances,
                });
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
    userState.cached,
    userState.balances,
    asc,
    handleBalanceDescription,
    handleBalanceBill,
    setUserState,
    balanceCreated,
  ]);

  const addBalance = async () => {
    const newBalance = {
      id: v4(),
      description: t("_accessibility:newValues.balances"),
      bill: true,
      created_at: new Date().getTime(),
    };
    if (!userState.cached) {
      const { error } = await addRemoteBalance(newBalance);
      if (error && error !== null) console.error(error.message);
    }
    setUserState({
      type: "init-balances",
      balances: [...userState.balances, newBalance],
    });
    setBalanceCreated((balanceCreated) => !balanceCreated);
    return newBalance.id;
  };

  const init = async () => {
    setLoadingBalances(true);
    if (!userState.cached) {
      const { data, error } = await fetchBalances();
      if (error && error !== null) {
        setLoadingBalances(false);
        return console.error(error.message);
      }
      if (!data.length && localStorage.getItem("basic-balance") === null) {
        const basicBalance = {
          id: v4(),
          created_at: new Date().getTime(),
          description: t("_accessibility:defaultValues.balanceTypes"),
          bill: true,
        };
        localStorage.setItem(
          "basic-balance",
          t("_accessibility:defaultValues.balanceTypes")
        );
        const insertBasic = await addRemoteBalance(basicBalance);
        if (insertBasic.error && insertBasic.error !== null)
          console.error(insertBasic.error.message);
        setUserState({
          type: "init-balances",
          balances: [basicBalance],
        });
      } else {
        // setting
        setUserState({
          type: "init-balances",
          balances: data,
        });
      }
    }

    setLoadingBalances(false);
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortAriaLabel = useMemo(() => {
    return `${t("_accessibility:ariaLabels.sort")} ${t(
      `_accessibility:ariaLabels.${asc ? "asc" : "desc"}`
    )} ${t("_accessibility:types.balanceTypes")}`;
  }, [asc, t]);

  return (
    <section>
      <div className="w-full flex items-center justify-between">
        <h3 className="text-xl">
          {t("_pages:settings.sections.balanceTypes.title")}
        </h3>
        <div className="flex gap-3 items-center">
          <Tippy content={sortAriaLabel}>
            <IconButton
              name="filter"
              aria-label={sortAriaLabel}
              onClick={() => setAsc((asc) => !asc)}
              icon={
                <FontAwesomeIcon icon={asc ? faArrowDownAZ : faArrowUpAZ} />
              }
            />
          </Tippy>
          <Tippy>
            {" "}
            content=
            {`${t("_accessibility:ariaLabels.add")} ${t(
              "_accessibility:types.balanceTypes"
            )}`}
            <IconButton
              aria-label={`${t("_accessibility:ariaLabels.add")} ${t(
                "_accessibility:types.balanceTypes"
              )}`}
              name="add-balance"
              onClick={addBalance}
              icon={<FontAwesomeIcon icon={faAdd} />}
            />
          </Tippy>
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
