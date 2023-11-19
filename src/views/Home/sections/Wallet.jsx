import { useState } from "react";
import { useDebounce } from "use-lodash-debounce";
import { Link } from "react-router-dom";

// @emotion/css
import { css } from "@emotion/css";

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
          className={css({ background: "none" })}
          onDebounceTrigger={() => console.log("wallet")}
        />
      </p>
      <div className="flex gap-3">
        <IconButton icon={faRefresh} tooltip="Cambiar de cuenta" />
        <Link>
          <IconButton icon={faAdd} tooltip="Crear una nueva cuenta" />
        </Link>
      </div>
    </section>
  );
}

export default Wallet;
