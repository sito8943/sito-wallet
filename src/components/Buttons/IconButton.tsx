import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// types
import { IconButtonPropsType } from "./types";

const IconButton = (props: IconButtonPropsType) => {
  const { className = "", children, icon, ...rest } = props;

  return (
    <button className={`icon-button ${className}`} {...rest}>
      <FontAwesomeIcon icon={icon} />
      {children}
    </button>
  );
};

export default IconButton;
