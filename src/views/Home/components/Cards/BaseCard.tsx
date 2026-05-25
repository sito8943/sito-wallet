// types
import type { BaseCardPropsType } from "./types";

import { classNames } from "@sito/dashboard-app";

// styles
import "./styles.css";

export const BaseCard = (props: BaseCardPropsType) => {
  const { children, className = "" } = props;

  return (
    <article className={classNames("base-card", "base-border", className)}>
      {children}
    </article>
  );
};
