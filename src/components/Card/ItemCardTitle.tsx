import { useContext } from "react";
import { classNames } from "@sito/dashboard-app";

import { ItemCardDeletedContext } from "./ItemCardContext";
import type { ItemCardTitlePropsType } from "./types";

import "./styles.css";

export const ItemCardTitle = (props: ItemCardTitlePropsType) => {
  const cardDeleted = useContext(ItemCardDeletedContext);
  // Inside an ItemCard the card's deleted state applies unless overridden.
  const { children, deleted = cardDeleted, className = "" } = props;

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
