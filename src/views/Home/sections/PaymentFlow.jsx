import { useRef, useMemo, useEffect, useState } from "react";
import { useInViewport } from "react-in-viewport";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    let resultR = (100 * result) / total;
    if (resultR < 80) resultR += 80;
    if (resultR >= 400) resultR = 400;
    return resultR;
  };

  return (
    <section className="min-h-[calc(100vh-350px)] max-h-[490px] flex flex-col justify-between items-start">
      <div className="flex flex-col justify-start items-start">
        <h3 className="text-3xl xs:text-xl">
          {t("_pages:home.paymentFlow.title")}
        </h3>
        <Link
          to="/spent"
          className="button primary mb-5 !p-0 !bg-[#00000000] cursor-pointer"
        >
          {t("_pages:routes.allSpent")}
        </Link>
      </div>
      <div className="flex w-full h-full" ref={myRef}>
        <PaymentFlowBar
          id="spent"
          icon={faArrowTrendDown}
          number={totalSpent}
          show={inViewport}
          label={t("_pages:home.paymentFlow.bars.bills")}
          color="error filled"
          showHeight={fetchPercentOf(
            totalSpent,
            initial + totalSpent + incoming
          )}
        />
        <PaymentFlowBar
          id="incoming"
          icon={faArrowTrendUp}
          number={incoming}
          show={inViewport}
          label={t("_pages:home.paymentFlow.bars.incoming")}
          color="success filled"
          showHeight={fetchPercentOf(incoming, initial + totalSpent + incoming)}
        />
        <PaymentFlowBar
          id="digital"
          icon={faCreditCard}
          number={digital}
          show={inViewport}
          label={t("_pages:home.paymentFlow.bars.digital")}
          color="info filled"
          showHeight={fetchPercentOf(digital, initial + totalSpent + incoming)}
        />
      </div>
    </section>
  );
}

export default PaymentFlow;
