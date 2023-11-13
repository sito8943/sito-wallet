import { useMemo } from "react";
// @sito/ui
import { IconButton, ToTop } from "@sito/ui";

// providers
import { useUser } from "../../providers/UserProvider";

// components
import Bill from "./Bill/Bill";
import {
  faAdd,
  faFilter,
  faSort,
  faSortAmountUp,
} from "@fortawesome/free-solid-svg-icons";

function Home() {
  const { userState } = useUser();

  const countLeft = useMemo(() => {
    if (userState.user.spent && userState.user.initial)
      return userState.user.initial - userState.user.spent;
    return 7500.69;
  }, [userState]);

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
    if (userState.user) {
      const percentOfSpent = (countLeft * 100) / userState.user.spent;
      if (percentOfSpent > 99) return "text-info";
      else if (percentOfSpent > 50) return "text-success";
      else if (percentOfSpent > 40) return "text-warning";
      else return "text-error";
    }
    return "text-success";
  }, [countLeft, userState]);

  const printBills = useMemo(() => {
    if (userState.user)
      return userState.user.bills.map((bill) => (
        <li key={bill.id}>
          <Bill />
        </li>
      ));
  }, [userState]);

  const currentCurrency = useMemo(() => {
    return "CUP";
  }, []);

  return (
    <div className="min-h-screen p-10 sm:p-3 pt-20 mt-20 flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <div className="flex w-full items-end justify-between">
          <h2 className={`text-8xl md:text-7xl xs:text-4xl ${severity}`}>
            <span className="text-primary-default">$</span>
            {countLeft}
          </h2>
          <p className="primary text-3xl xs:text-xl text-primary-default">
            {currentCurrency}
          </p>
        </div>
        <hr className="w-full border-4 text-primary-default" />
        <p className="text-primary-default text-xl">
          Quedan en {currentMonth}. Por {leftDays} días
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="w-full flex items-center justify-between">
          <h3 className="text-3xl">Gastos en el día</h3>
          <div className="flex gap-3 items-center">
            <IconButton
              name="filter"
              aria-label="Filtrar gastos"
              onClick={() => console.log("filtro")}
              icon={faSortAmountUp}
            />
            <IconButton
              aria-label="Agregar gasto"
              name="add-bill"
              onClick={() => console.log("add")}
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
