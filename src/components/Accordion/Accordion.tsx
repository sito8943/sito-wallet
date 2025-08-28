// types
import { AccordionPropsType } from "./types";

// styles
import "./styles.css";

export const Accordion = (props: AccordionPropsType) => {
  const { open, children, className = "", contentClassName = "" } = props;

  return (
    <div className={`accordion-main ${className} ${open ? "open" : "closed"}`}>
      <div className={`accordion-content ${contentClassName}`}>{children}</div>
    </div>
  );
};
