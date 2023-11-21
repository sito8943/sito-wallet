import { useRef, useMemo, useEffect, useState } from "react";
import { useInViewport } from "react-in-viewport";

import {
  faCreditCard,
  faDollar,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";

// providers
import { useUser } from "../../../providers/UserProvider";

// services
import { fetchBills, fetchFirstLog } from "../../../services/wallet";

// components
import PaymentFlowBar from "../components/PaymentFlowBar/PaymentFlowBar";

// styles
import "./styles.css";

function PaymentFlow() {
  const { userState } = useUser();

  const myRef = useRef();
  const { inViewport } = useInViewport(myRef);

  const [allBills, setAllBills] = useState([]);
  const [initial, setInitial] = useState(1);

  const fetchAllBills = async () => {
    const now = new Date();
    const { data, error } = await fetchBills(
      undefined,
      now.getFullYear(),
      now.getMonth(),
      null
    );
    if (error && error !== null) console.error(error.message);
    else setAllBills(data);
  };

  const totalSpent = useMemo(() => {
    let spent = 0;
    allBills.forEach((bill) => {
      spent += Number(bill.spent);
    });
    return spent;
  }, [allBills]);

  const digital = useMemo(() => {
    return initial - totalSpent;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSpent]);

  useEffect(() => {
    fetchAllBills();
  }, [userState]);

  useEffect(() => {
    fetchFirstLog().then(({ data, error }) => {
      console.log(data, error);
      if (error && error !== null) {
        console.error(error.message);
        return 0;
      }
      if (data.length) setInitial(data[0].initial);
      console.log("no?");
    });
  }, [userState]);

  return (
    <section className="h-[490px] flex flex-col">
      <h3 className="text-3xl xs:text-xl">Flujo mensual</h3>
      <div className="flex w-full h-full" ref={myRef}>
        <PaymentFlowBar
          id="spent"
          icon={faDollar}
          number={totalSpent}
          show={inViewport}
          label={"Gastos"}
          color="bg-primary-300 dark:bg-primary-default"
          labelColor="text-primary-300 dark:text-primary-default"
          showHeight={400}
        />
        <PaymentFlowBar
          id="digital"
          icon={faCreditCard}
          number={digital}
          show={inViewport}
          label={"Digital"}
          color="bg-secondary-300"
          labelColor="text-secondary-300"
          showHeight={300}
        />
        <PaymentFlowBar
          id="cash"
          icon={faWallet}
          number={userState.cash ?? 0}
          show={inViewport}
          label={"Efectivo"}
          color="bg-ternary-300 dark:bg-ternary-200"
          labelColor="text-ternary-300 dark:text-ternary-200"
          showHeight={200}
        />
      </div>
    </section>
  );
}

export default PaymentFlow;
