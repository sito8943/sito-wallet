import { useState } from "react";

// @sito/ui
import { Loading } from "@sito/ui";

// sections
import Password from "./sections/Password";
import BalanceTypes from "./sections/BalanceTypes";
import Accounts from "./sections/Accounts";

function Settings() {
  const [sync, setSync] = useState(false);
  return (
    <main className="flex flex-col viewport">
      <div className="p-10 sm:p-3 pt-20 mt-20 flex flex-col gap-10 flex-1">
        <div
          className={`w-10 h-10 fixed bottom-1 left-1 transition-all duration-300 ease-in-out ${
            sync ? "scale-100" : "scale-0"
          } pointer-events-none`}
        >
          <Loading className="sync rounded-full" strokeWidth="8" />
        </div>
        <h2 className="text-6xl md:text-5xl sm:text-4xl xs:text-3xl">
          Configuración
        </h2>
        <Password />
        <BalanceTypes />
        <Accounts />
      </div>
    </main>
  );
}

export default Settings;
