import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";

// types
import { NavbarPropsType } from "./types.js";

// styles
import "./styles.css";

// clock
import { Clock } from "./Clock";

// components
import { IconButton, SearchModal } from "components";

// utils
import { isMac } from "lib";

export function Navbar(props: NavbarPropsType) {
  const { t } = useTranslation();

  const location = useLocation();

  const { openDrawer } = props;

  const [showDialog, setShowDialog] = useState(false);

  const openOnKeyCombination = useCallback((e: KeyboardEvent) => {
    const primary = isMac() ? e.metaKey : e.ctrlKey;
    if (primary && e.shiftKey && e.key.toLowerCase() === "f") {
      setShowDialog(true);
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", openOnKeyCombination);
    return () => {
      window.removeEventListener("keydown", openOnKeyCombination);
    };
  }, [openOnKeyCombination]);

  return (
    <>
      {location.pathname !== "/" && (
        <SearchModal open={showDialog} onClose={() => setShowDialog(false)} />
      )}
      <header id="header" className="header">
        <div className="flex gap-2 items-center">
          <button
            type="button"
            name={t("_accessibility:buttons.openMenu")}
            aria-label={t("_accessibility:ariaLabels.openMenu")}
            onClick={openDrawer}
            className="button menu animated"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <h1 className="text-lg text-text pointer-events-none poppins font-bold">
            {t("_pages:home.appName")}
          </h1>
        </div>
        <div className="flex items-center justify-end gap-2">
          <IconButton
            icon={faSearch}
            className="min-xs:!hidden"
            onClick={() => setShowDialog(true)}
          />
          <Clock />
        </div>
      </header>
    </>
  );
}
