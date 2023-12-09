import { useMemo } from "react";
import PropTypes from "prop-types";

// @sito/ui
import { IconButton } from "@sito/ui";

function FAB(props) {
  const position = useMemo(() => {
    switch (props.position) {
      case "top-left":
        return "top-5 left-5";
      case "top-right":
        return "top-5 right-5";
      case "bottom-left":
        return "bottom-5 left-5";
      default: // bottom - right
        return "bottom-5 right-5";
    }
  }, [props.position]);

  return (
    <IconButton
      {...props}
      className={`fixed ${position} ${props.className}`}
      icon={props.icon}
    />
  );
}

FAB.defaultProps = {
  shape: "filled",
  position: "bottom-right",
};

FAB.propTypes = {
  shape: PropTypes.oneOf(["filled", "outlined", "text"]),
  className: PropTypes.string,
  icon: PropTypes.object.isRequired,
  position: PropTypes.oneOf([
    "top-left",
    "top-right",
    "bottom-right",
    "bottom-left",
  ]),
};

export default FAB;
