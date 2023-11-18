import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-lodash-debounce";
import PropTypes from "prop-types";

// providers
import { useUser } from "../../../providers/UserProvider";

// services
import { fetchFirstLog, fetchLog, updateLog } from "../../../services/wallet";

// components
import Counter from "../components/Counter/Counter";

function Header({ setSync }) {
  const { setUserState } = useUser();

  const [loadingMoney, setLoadingMoney] = useState(true);

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
  }, [debouncedInitial, setSync]);

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

  const [spent, setSpent] = useState(0);

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

  const currentCurrency = useMemo(() => {
    return "CUP";
  }, []);

  const onWalletChange = (e) => {
    setSync(true);
    const { target } = e;
    const value = target.innerText;
    setInitial(Number(value.replaceAll(",", "")));
  };

  const init = async () => {
    setLoadingMoney(true);
    const { data, error } = await fetchLog();
    if (error && error !== null) {
      setLoadingMoney(false);
      return console.error(error.message);
    }

    if (data.length) {
      const { initial, spent } = data[0];
      setInitial(initial);
      setSpent(spent);
      console.log(initial, spent);
      setUserState({
        type: "init-day-log",
        initial,
        spent,
      });
    }
    setLoadingMoney(false);
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
  );
}

Header.propTypes = {
  setSync: PropTypes.func,
};

export default Header;