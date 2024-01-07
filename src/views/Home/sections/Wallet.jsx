import { useState, useEffect } from "react";
import { useDebounce } from "use-lodash-debounce";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { faAdd, faRefresh } from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { IconButton } from "@sito/ui";

// components
import DebouncedInput from "../../../components/DebouncedInput/DebouncedInput";

// providers
import { useUser } from "../../../providers/UserProvider";

function Wallet({ setSync }) {
  const { t } = useTranslation();

  const { userState } = useUser();
  const [wallet, setWallet] = useState(userState.account?.name ?? "Mi Cuenta");

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
          tooltip={t("_pages:wallets.changeAccount")}
          aria-label={t("_pages:wallets.changeAccount")}
          name="change-account"
        />
        <Link
          name="create-new-account"
          aria-label={t("_pages:home.wallets.createNewAccount")}
        >
          <IconButton
            icon={faAdd}
            tooltip={t("_pages:home.wallets.createNewAccount")}
            aria-label={t("_pages:home.wallets.createNewAccount")}
            name="create-new-account"
          />
        </Link>
      </div>
    </section>
  );
}

export default Wallet;
