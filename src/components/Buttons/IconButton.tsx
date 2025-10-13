import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// types
import { IconButtonPropsType } from "./types";

// styles
import "./styles.css";

export const IconButton = (props: IconButtonPropsType) => {
  const {
    children,
    icon,
    type = "button",
    className = "",
    variant = "text",
    color = "default",
    iconClassName = "",
    ...rest
  } = props;

  return (
    <button
      type={type}
      className={`icon-button ${className} ${variant} ${color}`}
      {...rest}
    >
      <FontAwesomeIcon icon={icon} className={`!w-auto ${iconClassName}`} />
      {children}
    </button>
  );
};
