import { useMemo } from "react";
// @sito/ui
import { ToTop } from "@sito/ui";

// providers
import { useUser } from "../../providers/UserProvider";

function Home() {
  const { userState } = useUser();

  const countLeft = useMemo(() => {
    if (userState.user.spent && userState.user.total)
      return userState.user.total - userState.user.spent;
    return "7'500.69";
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
    return "good";
  }, [countLeft]);

  const currentCurrency = useMemo(() => {
    return "CUP";
  }, []);

  return (
    <div className="min-h-screen p-10 xs:p-3 pt-20 mt-20">
      <div className="flex flex-col gap-3">
        <div className="flex w-full items-end justify-between">
          <h2 className="text-8xl md:text-7xl xs:text-4xl text-primary-300">
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
      <ToTop />
    </div>
  );
}

export default Home;
