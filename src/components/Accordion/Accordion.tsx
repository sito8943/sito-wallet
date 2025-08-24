// types
import { AccordionPropsType } from "./types";

// styles
import "./styles.css";

export const Accordion = (props: AccordionPropsType) => {
  const { open, children, className = "" } = props;

  return (
    <div className={`accordion-main ${className} ${open ? "open" : "closed"}`}>
      {children}
    </div>
  );
};
