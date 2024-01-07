import PropTypes from "prop-types";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { useMode } from "@sito/ui";

// components
import FAB from "../FAB/FAB";
import { t } from "i18next";

function ModeButton({ className, color = "secondary" }) {
  const { toggleMode, mode } = useMode();

  return (
    <FAB
      onClick={() => toggleMode()}
      tooltip={
        mode === "dark"
          ? t("_accessibility:ariaLabels.lightMode")
          : t("_accessibility:ariaLabels.darkMode")
      }
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
  );
}

ModeButton.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "error", "success"]),
  className: PropTypes.string,
};

export default ModeButton;
