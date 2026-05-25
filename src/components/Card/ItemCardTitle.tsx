import type { ItemCardTitlePropsType } from "./types";
import { classNames } from "@sito/dashboard-app";

import "./styles.css";

export const ItemCardTitle = (props: ItemCardTitlePropsType) => {
  const { children, deleted = false, className = "" } = props;

  return (
    <h3
      className={classNames(
        "item-card-title",
        deleted ? "item-card-title--deleted" : "item-card-title--active",
        className,
      )}
    >
      {children}
    </h3>
  );
};
