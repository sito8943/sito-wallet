import { useState, useMemo, useCallback, useEffect } from "react";
import { v4 } from "uuid";
import { sortBy } from "some-javascript-utils/array";
import { useDebounce } from "use-lodash-debounce";

import {
  faAdd,
  faSortAmountDown,
  faSortAmountUp,
} from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { IconButton, Loading, ToTop } from "@sito/ui";

// providers
import { useUser } from "../../providers/UserProvider";

// services
import {
  addBill as addRemoteBill,
  fetchDay,
  fetchBills,
  initDay,
  updateBill,
  fetchFirstLog,
  updateLog,
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

  const [bills, setBills] = useState([]);
  const [spent, setSpent] = useState(0);
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
  }, [debouncedInitial]);

  const init = async () => {
    setLoadingMoney(true);
    setLoadingBills(true);
    const { data, error } = await fetchDay();
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
      const responseBills = await fetchBills();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      if (percentOfSpent > 50) return "text-success";
      else if (percentOfSpent > 40) return "text-warning";
      else return "text-error";
    }
    return "text-success";
  }, [countLeft, monthInitial]);

  const [sync, setSync] = useState(false);
  const [toUpdate, setToUpdate] = useState({});

  const handleBillDescription = useCallback(
    (bill) => setToUpdate({ ...bill, description: true }),
    []
  );

  const handleBillSpent = useCallback(
    (bill) => setToUpdate({ ...bill, spent: true }),
    []
  );

  const updateLocalBill = async (bill) => {
    const index = bills.findIndex((b) => b.id === bill.id);
    if (index >= 0) {
      if (bill.description) bills[index].description = bill.value;
      if (bill.spent) bills[index].spent = bill.value;
      delete bill.value;
      const { error } = await updateBill(bills[index]);
      if (error && error !== null) {
        setSync(false);
        return console.error(error.message);
      }
      setBills([...bills]);
    }

    setSync(false);
  };

  useEffect(() => {
    if (Object.keys(toUpdate).length) updateLocalBill(toUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toUpdate]);

  const printBills = useMemo(() => {
    if (loadingBills) {
      return [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <li key={item}>
          <div className="w-full h-[44px] skeleton-box" />
        </li>
      ));
    }

    if (bills)
      return sortBy(bills, "spent", asc).map((bill) => {
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
            />
          </li>
        );
      });
    return <></>;
  }, [loadingBills, bills, asc, handleBillDescription, handleBillSpent]);

  const currentCurrency = useMemo(() => {
    return "CUP";
  }, []);

  const onWalletChange = (e) => {
    setSync(true);
    const { target } = e;
    const value = target.innerText;
    setInitial(Number(value.replaceAll(",", "")));
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
    <div className="p-10 sm:p-3 pt-20 mt-20 flex flex-col gap-10">
      <div
        className={`w-10 h-10 fixed bottom-1 left-1 transition-all duration-300 ease-in-out ${
          sync ? "scale-100" : "scale-0"
        } pointer-events-none`}
      >
        <Loading className="sync" strokeWidth="8" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex w-full items-end justify-between">
          {!loadingMoney ? (
            <>
              <h2
                className={`text-8xl md:text-7xl sm:text-6xl xs:text-5xl ${severity} flex`}
              >
                <span className="text-primary-default opacity-40 mr-2">$</span>
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
        <hr className="w-full border-2 text-primary-default" />
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
