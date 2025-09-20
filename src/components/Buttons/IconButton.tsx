import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// types
import { IconButtonPropsType } from "./types";

// styles
import "./styles.css";

export const IconButton = (props: IconButtonPropsType) => {
  const { className = "", children, icon, type = "button", ...rest } = props;

  return (
    <button className={`icon-button ${className}`} {...rest} type={type}>
      <FontAwesomeIcon icon={icon} className="!w-auto" />
      {children}
    </button>
  );
};
