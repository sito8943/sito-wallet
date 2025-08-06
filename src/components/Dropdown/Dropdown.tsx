// types
import { DropdownPropsType } from "./types";

// styles
import "./styles.css";

export const Dropdown = (props: DropdownPropsType) => {
  const { children } = props;

  return <div className="dropdown-main">{children}</div>;
};
