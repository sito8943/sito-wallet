// types
import type { AccordionPropsType } from "./types";

import { classNames } from "@sito/dashboard-app";

// styles
import "./styles.css";

export const Accordion = (props: AccordionPropsType) => {
  const { open, children, className = "", contentClassName = "" } = props;

  return (
    <div
      className={classNames(
        "accordion-main",
        className,
        open ? "open" : "closed",
      )}
    >
      <div className={classNames("accordion-content", contentClassName)}>
        {children}
      </div>
    </div>
  );
};
