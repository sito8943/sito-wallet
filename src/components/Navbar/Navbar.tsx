import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

// types
import { NavbarPropsType } from "./types.js";

// styles
import "./styles.css";

export function Navbar(props: NavbarPropsType) {
  const { t } = useTranslation();

  const { openDrawer } = props;

  return (
    <header id="header" className="header bg-base">
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
        <h1 className="text-lg text-text pointer-events-none">
          {t("_pages:home.appName")}
        </h1>
      </div>
    </header>
  );
}
