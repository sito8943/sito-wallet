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
  addBill as addRemoteBill,
  fetchCurrentDay,
  fetchCurrentBills,
  initDay,
} from "../../services/wallet";

// components
import Bill from "./Bill/Bill";
import Counter from "./Counter/Counter";

// styles
import "./styles.css";

function Home() {
  const { userState, setUserState } = useUser();

  const [loadingMoney, setLoadingMoney] = useState(true);
  const [loadingBills, setLoadingBills] = useState(true);

  const [asc, setAsc] = useState(false);

  const [bills, setBills] = useState([]);
  const [spent, setSpent] = useState(0);
  const [initial, setInitial] = useState(1);

  const init = async () => {
    setLoadingMoney(true);
    setLoadingBills(true);
    const { data, error } = await fetchCurrentDay();
    if (error && error !== null) {
      setLoadingMoney(false);
      setLoadingBills(false);
      return console.error(error.message);
    }
    if (!data.length) {
      const { error } = initDay();
      if (error && error !== null) console.error(error);
      setUserState({
        type: "init-day",
        initial: 1,
        spent: 0,
        bills: [],
      });
    } else {
      const { initial, spent } = data[0];
      setLoadingMoney(false);
      const responseBills = await fetchCurrentBills();
      if (responseBills.error && responseBills.error !== null) {
        setLoadingBills(false);
        return console.error(responseBills.error.message);
      }
      // setting
      setBills(responseBills.data);
      setInitial(initial);
      setSpent(spent);
      setUserState({
        type: "init-day",
        initial,
        spent,
        bills: responseBills.data,
      });
    }
    setLoadingMoney(false);
    setLoadingBills(false);
  };

  useEffect(() => {
    init();
  }, []);

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
    if (loadingBills)
      return [1, 2, 3, 4, 6, 7, 8, 8].map((item) => (
        <li key={item}>
          <div className="w-full h-[44px] skeleton-box" />
        </li>
      ));
    if (bills)
      return sortBy(bills, "spent", asc).map((bill) => (
        <li key={bill.id} className="appear">
          <Bill
            {...bill}
            onChangeDescription={(e) =>
              handleBillDescription({ value: e.target.innerText, id: bill.id })
            }
            onChangeSpent={(e) =>
              handleBillSpent({ value: e.target.innerText, id: bill.id })
            }
          />
        </li>
      ));
    return <></>;
  }, [loadingBills, bills, asc, handleBillDescription, handleBillSpent]);

  const currentCurrency = useMemo(() => {
    return "CUP";
  }, []);

  const onWalletChange = (e) => {
    const { target } = e;
    const value = target.innerText;
    setInitial(Number(value));
  };

  const addBill = async () => {
    const newBill = {
      id: v4(),
      description: "Nuevo gasto",
      spent: 0,
      created_at: new Date().getTime(),
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date().getDate(),
    };
    const { error } = await addRemoteBill(newBill);
    if (error && error !== null) console.error(error.message);
    else setBills([...bills, newBill]);
  };

  return (
    <div className="min-h-screen p-10 sm:p-3 pt-20 mt-20 flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <div className="flex w-full items-end justify-between">
          {!loadingMoney ? (
            <>
              <h2
                className={`text-8xl md:text-7xl xs:text-4xl ${severity} flex`}
              >
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
            </>
          ) : (
            <div className="w-full h-[72px] skeleton-box" />
          )}
        </div>
        <hr className="w-full border-4 text-primary-default" />
        {!loadingMoney ? (
          <p className="text-primary-default text-xl xs:text-[16px]">
            Quedan en {currentMonth}. Por {leftDays} días
          </p>
        ) : (
          <div className="w-full h-[28px] skeleton-box" />
        )}
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
              onClick={addBill}
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
