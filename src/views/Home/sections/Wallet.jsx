import { useState, useEffect } from "react";
import { useDebounce } from "use-lodash-debounce";
import Tippy from "@tippyjs/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { faAdd, faRefresh } from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { IconButton } from "@sito/ui";

// components
import DebouncedInput from "../../../components/DebouncedInput/DebouncedInput";

// providers
import { useUser } from "../../../providers/UserProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Wallet({ setSync }) {
  const { t } = useTranslation();

  const { userState } = useUser();
  const [wallet, setWallet] = useState(userState.account?.name ?? "Mi Cuenta");

  return (
    <section className="flex justify-between items-center w-full">
      <p className="font-bold text-xl">
        <DebouncedInput
          initialValue={wallet}
          className={"no-bg w-full"}
          onDebounceTrigger={() => console.log("wallet")}
        />
      </p>
      <div className="flex gap-3">
        <Tippy content={t("_pages:wallets.changeAccount")}>
          <IconButton
            icon={<FontAwesomeIcon icon={faRefresh} />}
            aria-label={t("_pages:wallets.changeAccount")}
            name="change-account"
          />
        </Tippy>

        <Link
          name="create-new-account"
          aria-label={t("_pages:home.wallets.createNewAccount")}
        >
          <Tippy content={t("_pages:home.wallets.createNewAccount")}>
            <IconButton
              icon={<FontAwesomeIcon icon={faAdd} />}
              aria-label={t("_pages:home.wallets.createNewAccount")}
              name="create-new-account"
            />
          </Tippy>
        </Link>
      </div>
    </section>
  );
}

export default Wallet;
