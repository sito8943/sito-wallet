import { useRef, useMemo, useEffect, useState } from "react";
import { useInViewport } from "react-in-viewport";

import {
  faArrowTrendDown,
  faArrowTrendUp,
  faCreditCard,
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
    const { data, error } = await fetchBills({
      account: userState.account?.id,
      year: now.getFullYear(),
      month: now.getMonth(),
      day: null,
    });
    if (error && error !== null) console.error(error.message);
    else setAllBills(data);
  };

  const incoming = useMemo(() => {
    let income = 0;
    allBills.forEach((bill) => {
      if (!bill.walletBalances.bill) income += Number(bill.spent);
    });
    return income;
  }, [allBills]);

  const totalSpent = useMemo(() => {
    let spent = 0;
    allBills.forEach((bill) => {
      if (bill.walletBalances.bill) spent += Number(bill.spent);
    });
    return spent;
  }, [allBills]);

  const digital = useMemo(() => {
    return initial - totalSpent + incoming;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSpent, initial, incoming]);

  useEffect(() => {
    fetchAllBills();
  }, [userState, userState.bills]);

  useEffect(() => {
    if (userState.account)
      fetchFirstLog(userState.account.id).then(({ data, error }) => {
        if (error && error !== null) {
          console.error(error.message);
          return 0;
        }
        if (data.length) setInitial(data[0].initial);
      });
  }, [userState.account]);

  const fetchPercentOf = (result, total = 450) => {
    let resultR = (total * result) / 100;
    if (resultR < 80) resultR += 80;
    if (resultR >= 400) resultR = 400;
    return resultR;
  };

  return (
    <section className="h-[490px] flex flex-col">
      <h3 className="text-3xl xs:text-xl">Flujo mensual</h3>
      <div className="flex w-full h-full" ref={myRef}>
        <PaymentFlowBar
          id="spent"
          icon={faArrowTrendDown}
          number={totalSpent}
          show={inViewport}
          label={"Gastos"}
          color="bg-primary-400 dark:bg-primary-600"
          labelColor="text-primary-400"
          showHeight={fetchPercentOf((totalSpent * 100) / initial)}
        />
        <PaymentFlowBar
          id="incoming"
          icon={faArrowTrendUp}
          number={incoming}
          show={inViewport}
          label={"Ingresos"}
          color="bg-secondary-600 dark:bg-secondary-600"
          labelColor="text-secondary-600"
          showHeight={fetchPercentOf((incoming * 100) / initial)}
        />
        <PaymentFlowBar
          id="digital"
          icon={faCreditCard}
          number={digital}
          show={inViewport}
          label={"Digital"}
          color="bg-ternary-600"
          labelColor="text-ternary-600"
          showHeight={fetchPercentOf((digital * 100) / initial)}
        />
      </div>
    </section>
  );
}

export default PaymentFlow;
