// components
import { Actions, ItemCardTitle } from "components";

// lib
import { BaseEntityDto } from "lib";

// types
import { ItemCardPropsType } from "./types.ts";

// styles
import "./styles.css";

export function ItemCard<TRow extends BaseEntityDto>(
  props: ItemCardPropsType<TRow>
) {
  const {
    children,
    containerClassName = "",
    actions = [],
    title,
    className = "",
    deleted,
    ...rest
  } = props;

  return (
    <div
      className={`${containerClassName} flex flex-col justify-between items-start min-h-40 w-70 max-xs:w-full rounded-2xl p-3 bg-base group ${
        deleted
          ? "border-secondary/30"
          : "border-primary/30 hover:border-primary"
      } border-2 animated`}
    >
      <button
        className={`${
          deleted ? "" : "cursor-pointer"
        } h-full w-full flex flex-col justify-start items-start ${className}`}
        {...rest}
      >
        {typeof title === "string" || typeof title === "number" ? (
          <ItemCardTitle>{title}</ItemCardTitle>
        ) : (
          title
        )}
        {children}
      </button>
      <Actions actions={actions} />
    </div>
  );
}
