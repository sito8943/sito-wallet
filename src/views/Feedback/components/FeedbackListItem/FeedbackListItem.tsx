import { useTranslation } from "react-i18next";

// icons
import { faCheck, faRotateLeft } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { IconButton } from "@sito/dashboard-app";

// lib
import { formatDateTime } from "lib";

// constants
import { RAW_INTERPOLATION } from "../../constants";

// utils
import {
  getFeedbackKindClassName,
  getFeedbackKindLabelKey,
  getFeedbackSourceLabelKey,
  isFeedbackResolved,
} from "../../utils";

// types
import type { FeedbackListItemPropsType } from "../../types";

/** One feedback entry: kind, text, who sent it, how and when. */
export function FeedbackListItem(props: FeedbackListItemPropsType) {
  const { entry, onToggleResolved, disabled } = props;
  const { t } = useTranslation();

  const resolved = isFeedbackResolved(entry);
  const actionLabel = t(
    resolved ? "_pages:feedback.reopenAction" : "_pages:feedback.resolveAction",
  );
  const kindLabel = t(getFeedbackKindLabelKey(entry.kind));

  return (
    <li
      className={`feedback-entry${resolved ? " feedback-entry--resolved" : ""}`}
    >
      <div className="feedback-entry-content">
        <span
          className={`feedback-kind ${getFeedbackKindClassName(entry.kind)}`}
        >
          {kindLabel}
        </span>
        <p className="feedback-entry-text">{entry.text}</p>
        <p className="feedback-entry-meta">
          <span>
            {t("_pages:feedback.entry.user", {
              username: entry.user.username,
              email: entry.user.email,
              interpolation: RAW_INTERPOLATION,
            })}
          </span>
          {entry.account && (
            <span>
              {t("_pages:feedback.entry.account", {
                name: entry.account.name,
                interpolation: RAW_INTERPOLATION,
              })}
            </span>
          )}
          <span>{t(getFeedbackSourceLabelKey(entry.source))}</span>
          <span>{formatDateTime(entry.createdAt)}</span>
          {entry.resolvedAt && (
            <span>
              {t("_pages:feedback.entry.resolvedAt", {
                date: formatDateTime(entry.resolvedAt),
                interpolation: RAW_INTERPOLATION,
              })}
            </span>
          )}
        </p>
      </div>
      <IconButton
        icon={resolved ? faRotateLeft : faCheck}
        type="button"
        color={resolved ? "primary" : "success"}
        disabled={disabled}
        aria-label={`${actionLabel}: ${kindLabel} #${entry.id}`}
        data-tooltip-id="tooltip"
        data-tooltip-content={actionLabel}
        onClick={() => onToggleResolved(entry)}
      />
    </li>
  );
}
