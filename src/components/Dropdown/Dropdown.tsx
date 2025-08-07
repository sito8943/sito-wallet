import { useEffect } from "react";

// types
import { DropdownPropsType } from "./types";

// styles
import "./styles.css";

export const Dropdown = (props: DropdownPropsType) => {
  const { children, open, onClose } = props;

  useEffect(() => {
    if (open) setTimeout(() => window.addEventListener("click", onClose), 300);
    return () => {
      window.removeEventListener("click", onClose);
    };
  }, [open, onClose]);

  return (
    <div className={`dropdown-main ${open ? "opened" : "closed"}`}>
      {children}
    </div>
  );
};
