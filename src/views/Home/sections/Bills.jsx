import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { useInViewport } from "react-in-viewport";
import { v4 } from "uuid";
import PropTypes from "prop-types";
import { sortBy } from "some-javascript-utils/array";
import { scrollTo } from "some-javascript-utils/browser";
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
} from "../../../services/wallet";

// providers
import { useUser } from "../../../providers/UserProvider";

// components
import Bill from "../components/Bill/Bill";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Bills({ setSync }) {
  const { setUserState } = useUser();

  const [loadingBills, setLoadingBills] = useState(true);

  const addButton = useRef();
  const { inViewport } = useInViewport(addButton);

  const [asc, setAsc] = useState(false);

  const [bills, setBills] = useState([]);

  const [toUpdate, setToUpdate] = useState({});

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

  const printBills = useMemo(() => {
    if (loadingBills) {
      return [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <li key={item}>
          <div className="w-full h-[44px] skeleton-box" />
        </li>
      ));
    }

    if (bills && bills.length)
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
              onDelete={async () => {
                setSync(true);
                const { error } = await deleteBill(bill.id);
                const newBills = [...bills];
                newBills.splice(
                  newBills.findIndex((billR) => billR.id === bill.id),
                  1
                );
                setBills(newBills);
                if (error && error !== null) console.error(error.message);
                setSync(false);
              }}
            />
          </li>
        );
      });
    return (
      <li>
        <p className="text-secondary-400 dark:text-secondary-default">
          ¿Ningún balance? Vamos bien{" "}
          <FontAwesomeIcon className="ternary" icon={faSmile} />
        </p>
      </li>
    );
  }, [
    setSync,
    loadingBills,
    bills,
    asc,
    handleBillDescription,
    handleBillSpent,
  ]);

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
    return newBill.id;
  };

  const init = async () => {
    setLoadingBills(true);
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
    } else {
      const responseBills = await fetchBills();
      if (responseBills.error && responseBills.error !== null) {
        setLoadingBills(false);
        return console.error(responseBills.error.message);
      }
      // setting
      setBills(responseBills.data);
      setUserState({
        type: "init-bills",
        bills: responseBills.data,
      });
    }

    setLoadingBills(false);
  };

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
      <ul>{printBills}</ul>
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
