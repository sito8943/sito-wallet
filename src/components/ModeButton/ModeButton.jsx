import PropTypes from "prop-types";
import Tippy from "@tippyjs/react";
import { useTranslation } from "react-i18next";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { useMode } from "@sito/ui";

// components
import FAB from "../FAB/FAB";

function ModeButton({ className, color = "primary" }) {
  const { toggleMode, mode } = useMode();

  const { t } = useTranslation();

  return (
    <Tippy
      content={
        mode === "dark"
          ? t("_accessibility:ariaLabels.lightMode")
          : t("_accessibility:ariaLabels.darkMode")
      }
    >
      <FAB
        onClick={() => toggleMode()}
        name="toggle-theme"
        shape="text"
        color={color}
        aria-label={
          mode === "dark"
            ? t("_accessibility:ariaLabels.lightMode")
            : t("_accessibility:ariaLabels.darkMode")
        }
        icon={mode === "dark" ? faSun : faMoon}
        className={className}
      />
    </Tippy>
  );
}

ModeButton.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "error", "success"]),
  className: PropTypes.string,
};

export default ModeButton;
