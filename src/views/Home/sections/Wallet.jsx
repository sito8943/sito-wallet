import { useState } from "react";
import { useDebounce } from "use-lodash-debounce";
import { Link } from "react-router-dom";

import { faAdd, faRefresh } from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { IconButton } from "@sito/ui";

// components
import DebouncedInput from "../../../components/DebouncedInput/DebouncedInput";

function Wallet() {
  const [wallet, setWallet] = useState("Mi Cuenta");

  return (
    <section className="flex justify-between items-center w-full">
      <p className="font-bold text-xl">
        <DebouncedInput
          initialValue={wallet}
          className={"no-bg"}
          onDebounceTrigger={() => console.log("wallet")}
        />
      </p>
      <div className="flex gap-3">
        <IconButton
          icon={faRefresh}
          tooltip="Cambiar de cuenta"
          aria-label="Cambiar de cuenta"
          name="change-account"
        />
        <Link name="create-new-account" aria-label="Crear nueva cuenta">
          <IconButton
            icon={faAdd}
            tooltip="Crear una nueva cuenta"
            aria-label="Crear nueva cuenta"
            name="create-new-account"
          />
        </Link>
      </div>
    </section>
  );
}

export default Wallet;
