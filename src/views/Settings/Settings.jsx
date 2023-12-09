import { useState } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

// components
import Syncing from "../../components/Syncing/Syncing";

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
          } pointer-events-none primary filled rounded-full`}
        >
          <Syncing />
        </div>
        <div className="flex items-center">
          <Link
            to="/"
            name="to-home"
            aria-label="Ir al inicio"
            className="button icon-button primary"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </Link>
          <h2 className="text-6xl md:text-5xl sm:text-4xl xs:text-3xl">
            Configuración
          </h2>
        </div>
        <Password />
        <BalanceTypes setSync={setSync} />
        <Accounts />
      </div>
    </main>
  );
}

export default Settings;
