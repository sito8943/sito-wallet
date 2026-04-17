import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// icons
import { faCircle, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// components
import { ItemCardTitle } from "./ItemCardTitle";

// @sito/dashboard-app
import { BaseEntityDto, Actions } from "@sito/dashboard-app";

// types
import { ItemCardPropsType } from "./types.ts";

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
      className={`${containerClassName} flex flex-col justify-between items-start min-h-40 w-full rounded-2xl p-3 bg-base group ${
        deleted
          ? "!border-bg-error border-2 opacity-60"
          : selectionMode
            ? selected
              ? "!border-bg-success border-2"
              : "base-border"
            : "base-border hover:!border-hover-primary"
      } animated`}
    >
      <div
        className={`${deleted || !hasInteractions ? "" : "cursor-pointer"} h-full w-full flex flex-col justify-start items-start ${className}`}
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
            className={`self-end text-sm ${selected ? "text-bg-success" : "text-text-muted"}`}
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
