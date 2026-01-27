import { useState } from "react";

// icons
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

// types
import { AccordionPropsType } from "./types";

// components
import { IconButton } from "@sito/dashboard-app";

// styles
import "./styles.css";

export const Accordion = (props: AccordionPropsType) => {
  const {
    open,
    defaultOpen = false,
    children,
    className = "",
    contentClassName = "",
  } = props;

  const [localOpen, setLocalOpen] = useState(open ?? defaultOpen);

  return (
    <div
      className={`accordion-main ${className} ${localOpen ? "open" : "closed"}`}
    >
      <IconButton
        className="absolute top-4 right-2"
        icon={localOpen ? faChevronUp : faChevronDown}
        onClick={() => setLocalOpen(!localOpen)}
      />
      <div className={`accordion-content ${contentClassName}`}>{children}</div>
    </div>
  );
};
