import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// icons
import { faCircle, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// components
import { ItemCardTitle } from "./ItemCardTitle";

// @sito/dashboard-app
import type { BaseEntityDto } from "@sito/dashboard-app";
import { Actions, classNames } from "@sito/dashboard-app";

// types
import type { ItemCardPropsType } from "./types.ts";

// styles
import "./styles.css";

export function ItemCard<TRow extends BaseEntityDto>(
  props: ItemCardPropsType<TRow>,
) {
  const { t } = useTranslation();

  const {
    children,
    containerClassName = "",
    actions = [],
    title,
    className = "",
    name,
    "aria-label": ariaLabel,
    deleted,
    onClick,
    selectionMode = false,
    selected = false,
    onToggleSelection,
    onLongPressSelection,
    ...rest
  } = props;
  const touchTimeoutRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);

  const clearTouchTimeout = useCallback(() => {
    if (touchTimeoutRef.current === null) return;
    window.clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = null;
  }, []);

  useEffect(() => {
    return () => clearTouchTimeout();
  }, [clearTouchTimeout]);

  const handleTouchStart = useCallback(() => {
    if (deleted || selectionMode || !onLongPressSelection) return;

    clearTouchTimeout();
    touchTimeoutRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      onLongPressSelection();
    }, 450);
  }, [clearTouchTimeout, deleted, onLongPressSelection, selectionMode]);

  const handleClick = useCallback(() => {
    if (deleted) return;

    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }

    if (selectionMode) {
      onToggleSelection?.();
      return;
    }

    onClick?.();
  }, [deleted, onClick, onToggleSelection, selectionMode]);

  const hasInteractions =
    !!onClick || !!onToggleSelection || !!onLongPressSelection;

  return (
    <div
      className={classNames(
        "item-card group animated",
        deleted
          ? "item-card--deleted"
          : selectionMode
            ? selected
              ? "item-card--selected base-border"
              : "item-card--selectable"
            : "item-card--idle base-border",
        containerClassName,
      )}
    >
      <div
        className={classNames(
          "item-card-content",
          !deleted && hasInteractions && "item-card-content--clickable",
          className,
        )}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={clearTouchTimeout}
        onTouchCancel={clearTouchTimeout}
        onTouchMove={clearTouchTimeout}
        {...rest}
        aria-label={
          selectionMode
            ? t("_accessibility:components.table.selectRow")
            : (ariaLabel ?? name)
        }
        aria-pressed={selectionMode ? selected : undefined}
      >
        {selectionMode && !deleted ? (
          <span
            className={classNames(
              "item-card-selection-indicator",
              selected
                ? "item-card-selection-indicator--selected"
                : "item-card-selection-indicator--idle",
            )}
          >
            <FontAwesomeIcon icon={selected ? faCircleCheck : faCircle} />
          </span>
        ) : null}
        {typeof title === "string" || typeof title === "number" ? (
          <ItemCardTitle>{title}</ItemCardTitle>
        ) : (
          title
        )}
        {children}
      </div>
      <Actions actions={selectionMode ? [] : actions} />
    </div>
  );
}
