// @sito/dashboard-app
import { classNames } from "@sito/dashboard-app";

// types
import type { ActivityItemPropsType } from "./types";

import "./styles.css";

/**
 * One entry of an editor's activity list (debt payment, billing log…).
 * Clickable entries render their content as a button; actions sit beside it
 * so buttons are never nested.
 */
export function ActivityItem(props: ActivityItemPropsType) {
  const {
    amount,
    meta,
    note,
    actions,
    onClick,
    "aria-label": ariaLabel,
  } = props;

  const content = (
    <>
      <span className="activity-item-amount">{amount}</span>
      <span className="activity-item-meta">{meta}</span>
      {note ? <span className="activity-item-note">{note}</span> : null}
    </>
  );

  return (
    <li
      className={classNames(
        "activity-item",
        onClick && "activity-item--clickable",
      )}
    >
      {onClick ? (
        <button
          type="button"
          className="activity-item-main"
          aria-label={ariaLabel}
          onClick={onClick}
        >
          {content}
        </button>
      ) : (
        <div className="activity-item-main">{content}</div>
      )}
      {actions ? <div className="activity-item-actions">{actions}</div> : null}
    </li>
  );
}
