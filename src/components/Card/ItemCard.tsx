import { useCallback, useEffect, useRef } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { useTranslation } from "react-i18next";

import { faCircle, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { BaseEntityDto } from "@sito/dashboard-app";
import { Actions, classNames } from "@sito/dashboard-app";

import { ItemCardTitle } from "./ItemCardTitle";
import { SwipeToDelete } from "./SwipeToDelete";
import type { ItemCardPropsType } from "./types.ts";
import {
  getDeleteAction,
  isActivationKey,
  shouldPreventMobileContextMenu,
  supportsHoverTooltips,
} from "./utils";

import "./styles.css";

export function ItemCard<TRow extends BaseEntityDto>(
  props: ItemCardPropsType<TRow>,
) {
  const { t } = useTranslation();

  const {
    children,
    containerClassName = "",
    containerStyle,
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
    swipeDeleteOpen = false,
    onSwipeDelete,
    ...rest
  } = props;
  const touchTimeoutRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);
  const deleteAction = getDeleteAction(actions);
  const showActionTooltips = supportsHoverTooltips();

  const clearTouchTimeout = useCallback(() => {
    if (touchTimeoutRef.current === null) return;
    window.clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = null;
  }, []);

  useEffect(() => {
    return () => clearTouchTimeout();
  }, [clearTouchTimeout]);

  const handleTouchStart = useCallback(() => {
    if (selectionMode || !onLongPressSelection) return;

    clearTouchTimeout();
    touchTimeoutRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      onLongPressSelection();
    }, 450);
  }, [clearTouchTimeout, onLongPressSelection, selectionMode]);

  const handleClick = useCallback(() => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }

    if (selectionMode) {
      onToggleSelection?.();
      return;
    }

    if (deleted) return;

    onClick?.();
  }, [deleted, onClick, onToggleSelection, selectionMode]);

  const handleContextMenu = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!shouldPreventMobileContextMenu(!!onLongPressSelection)) return;

      event.preventDefault();
    },
    [onLongPressSelection],
  );

  // Clickable area stays a div (role="button"): cards may nest their own
  // buttons (e.g. GoalCard), and a <button> inside a <button> is invalid.
  const isInteractive = selectionMode
    ? !!onToggleSelection
    : !deleted && !!onClick;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      // Ignore keys coming from nested controls (they handle their own).
      if (event.target !== event.currentTarget) return;
      if (!isActivationKey(event.key)) return;

      event.preventDefault();
      handleClick();
    },
    [handleClick],
  );

  return (
    <SwipeToDelete
      enabled={!!deleteAction && !!onSwipeDelete && !deleted && !selectionMode}
      deleteOpen={swipeDeleteOpen}
      onDeleteTrigger={() => onSwipeDelete?.()}
      onSwipeStart={clearTouchTimeout}
    >
      <div
        className={classNames(
          "item-card group animated",
          deleted
            ? selectionMode && selected
              ? "item-card--deleted item-card--selected base-border"
              : "item-card--deleted"
            : selectionMode
              ? selected
                ? "item-card--selected base-border"
                : "item-card--selectable"
              : "item-card--idle base-border",
          containerClassName,
        )}
        style={containerStyle}
      >
        <div
          className={classNames(
            "item-card-content",
            isInteractive && "item-card-content--clickable",
            className,
          )}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={clearTouchTimeout}
          onTouchCancel={clearTouchTimeout}
          onTouchMove={clearTouchTimeout}
          onContextMenu={handleContextMenu}
          {...rest}
          role={isInteractive ? "button" : undefined}
          tabIndex={isInteractive ? 0 : undefined}
          onKeyDown={isInteractive ? handleKeyDown : undefined}
          aria-label={
            !isInteractive
              ? undefined
              : selectionMode
                ? t("_accessibility:components.table.selectRow")
                : (ariaLabel ?? name)
          }
          aria-pressed={selectionMode ? selected : undefined}
        >
          {selectionMode ? (
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
        <Actions
          actions={selectionMode ? [] : actions}
          showTooltips={showActionTooltips}
        />
      </div>
    </SwipeToDelete>
  );
}
