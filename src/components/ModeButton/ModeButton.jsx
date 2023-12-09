import PropTypes from "prop-types";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { useMode } from "@sito/ui";

// components
import FAB from "../FAB/FAB";

function ModeButton({ className, color = "secondary" }) {
  const { toggleMode, mode } = useMode();

  return (
    <FAB
      onClick={() => toggleMode()}
      tooltip="Alternar tema (Claro/Oscuro)"
      name="toggle-theme"
      shape="text"
      color={color}
      aria-label="Click para cambiar el tema"
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
