import { useState, useMemo, useCallback, useEffect } from "react";
import { v4 } from "uuid";
import { sortBy } from "some-javascript-utils/array";

import {
  faAdd,
  faSortAmountDown,
  faSortAmountUp,
} from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { IconButton, ToTop } from "@sito/ui";

// providers
import { useUser } from "../../providers/UserProvider";

// services
import {
  fetchCurrentDay,
  fetchCurrentBills,
  initDay,
} from "../../services/wallet";

// components
import Bill from "./Bill/Bill";
import Counter from "./Counter/Counter";

function Home() {
  const { userState, setUserState } = useUser();

  const [asc, setAsc] = useState(false);
  const [bills, setBills] = useState(userState.user?.bills ?? []);
  const [spent, setSpent] = useState(userState.user?.spent ?? 0);
  const [initial, setInitial] = useState(userState.user?.initial ?? 1);

  const init = async () => {
    const { data, error } = await fetchCurrentDay();
    if (error && error !== null) return console.error(error.message);
    const { initial, spent } = data;
    const responseBills = await fetchCurrentBills();
    if (responseBills.error && responseBills.error !== null)
      return console.error(responseBills.error.message);
    setUserState({ type: "init-day", initial, spent, bills: responseBills });
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!userState.user.bills) userState.user.bills = [];
    if (!userState.user.spent) userState.user.spent = 0;
    if (!userState.user.initial) userState.user.initial = 1;
    const { error } = initDay();
    if (error && error !== null) console.error(error);
  }, [userState]);

  const countLeft = useMemo(() => {
    if (spent && initial) return initial - spent;
    return 7500.69;
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
    if (spent > 0) {
      const percentOfSpent = (countLeft * 100) / spent;
      if (percentOfSpent > 99) return "text-info";
      else if (percentOfSpent > 50) return "text-success";
      else if (percentOfSpent > 40) return "text-warning";
      else return "text-error";
    }
    return "text-success";
  }, [countLeft, spent]);

  const handleBillDescription = useCallback((bill) => {}, [bills]);
  const handleBillSpent = useCallback((bill) => {}, [bills]);

  const printBills = useMemo(() => {
    if (bills)
      return sortBy(bills, "spent", asc).map((bill) => (
        <li key={bill.id} className="appear">
          <Bill
            {...bill}
            onChangeDescription={handleBillDescription}
            onChangeSpent={handleBillSpent}
          />
        </li>
      ));
  }, [bills, asc, handleBillDescription, handleBillSpent]);

  const currentCurrency = useMemo(() => {
    return "CUP";
  }, []);

  const onWalletChange = (e) => {
    const { target } = e;
    const value = target.innerText;
    setInitial(Number(value));
  };

  return (
    <div className="min-h-screen p-10 sm:p-3 pt-20 mt-20 flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <div className="flex w-full items-end justify-between">
          <h2 className={`text-8xl md:text-7xl xs:text-4xl ${severity} flex`}>
            <span className="text-primary-default opacity-40">$</span>
            <Counter
              number={countLeft}
              containerProps={{
                contentEditable: true,
                onInput: onWalletChange,
              }}
            />
          </h2>
          <p className="primary text-3xl xs:text-xl text-primary-default">
            {currentCurrency}
          </p>
        </div>
        <hr className="w-full border-4 text-primary-default" />
        <p className="text-primary-default text-xl xs:text-[16px]">
          Quedan en {currentMonth}. Por {leftDays} días
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="w-full flex items-center justify-between">
          <h3 className="text-3xl xs:text-xl">Gastos en el día</h3>
          <div className="flex gap-3 items-center">
            <IconButton
              name="filter"
              aria-label="Filtrar gastos"
              onClick={() => setAsc((asc) => !asc)}
              icon={asc ? faSortAmountUp : faSortAmountDown}
            />
            <IconButton
              aria-label="Agregar gasto"
              name="add-bill"
              onClick={() =>
                setBills([
                  ...bills,
                  {
                    id: v4(),
                    description: "Nuevo gasto",
                    spent: 0,
                    created_at: new Date().getTime(),
                    year: new Date().getFullYear(),
                    month: currentMonth,
                    day: new Date().getDate(),
                  },
                ])
              }
              icon={faAdd}
            />
          </div>
        </div>
        <ul>{printBills}</ul>
      </div>
      <ToTop />
    </div>
  );
}

export default Home;
