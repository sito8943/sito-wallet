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

  return (
    <div className="min-h-screen p-10 pt-20 mt-20">
      <div className="flex flex-col gap-3">
        <h2 className="text-8xl secondary">
          <span className="">$</span>
          {countLeft}
        </h2>
        <hr className="w-full secondary border-4" />
        <p>
          Quedan en {currentMonth}. Por {leftDays} días
        </p>
      </div>
      <ToTop />
    </div>
  );
}

export default Home;
