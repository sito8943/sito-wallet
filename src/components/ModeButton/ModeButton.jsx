import PropTypes from "prop-types";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { useMode } from "@sito/ui";

// components
import FAB from "../FAB/FAB";

function ModeButton({ className }) {
  const { toggleMode, mode } = useMode();

  return (
    <FAB
      onClick={() => toggleMode()}
      tooltip="Alternar tema (Claro/Oscuro)"
      name="toggle-theme"
      aria-label="Click para cambiar el tema"
      icon={mode === "dark" ? faSun : faMoon}
      className={className}
    />
  );
}

ModeButton.propTypes = {
  className: PropTypes.string,
};

export default ModeButton;
