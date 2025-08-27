import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

// types
import { NavbarPropsType } from "./types.js";

// styles
import "./styles.css";

// clock
import { Clock } from "./Clock";

// hook
import { useScrollTrigger } from "hooks";

export function Navbar(props: NavbarPropsType) {
  const { t } = useTranslation();

  const { openDrawer } = props;

  const isScrolled = useScrollTrigger(100);

  return (
    <header id="header" className={`header ${isScrolled ? "fixed" : ""}`}>
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
      <div className="max-xs:hidden">
        <Clock />
      </div>
    </header>
  );
}
