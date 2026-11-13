import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Button, Error as ErrorView, Loading } from "@sito/dashboard-app";

// components
import { FeedbackListItem } from "../FeedbackListItem";

// utils
import { splitFeedbackByStatus } from "../../utils";

// types
import type { FeedbackSectionPropsType } from "../../types";

/** Open entries first; resolved ones behind a toggle. */
export function FeedbackSection(props: FeedbackSectionPropsType) {
  const { entries, isLoading, hasError, onRetry, onToggleResolved, pendingId } =
    props;
  const { t } = useTranslation();
  const [showResolved, setShowResolved] = useState(false);

  const { open, resolved } = useMemo(
    () => splitFeedbackByStatus(entries),
    [entries],
  );
  const visible = showResolved ? [...open, ...resolved] : open;

  return (
    <section className="feedback-card base-border">
      <div className="feedback-card-header">
        <h3 className="feedback-card-title">{t("_pages:feedback.inbox")}</h3>
        {!isLoading && !hasError && (
          <span className="feedback-muted">
            {t("_pages:feedback.openCount", { count: open.length })}
          </span>
        )}
      </div>
      {hasError ? (
        <ErrorView message={t("_accessibility:errors.500")} onRetry={onRetry} />
      ) : isLoading ? (
        <div className="feedback-loading">
          <Loading />
        </div>
      ) : entries.length === 0 ? (
        <p className="feedback-empty">{t("_pages:feedback.empty")}</p>
      ) : (
        <>
          {open.length === 0 && (
            <p className="feedback-empty">{t("_pages:feedback.allResolved")}</p>
          )}
          {visible.length > 0 && (
            <ul className="feedback-list">
              {visible.map((entry) => (
                <FeedbackListItem
                  key={entry.id}
                  entry={entry}
                  disabled={pendingId === entry.id}
                  onToggleResolved={onToggleResolved}
                />
              ))}
            </ul>
          )}
          {resolved.length > 0 && (
            <div className="feedback-toggle">
              <Button
                type="button"
                variant="text"
                aria-pressed={showResolved}
                onClick={() => setShowResolved((value) => !value)}
              >
                {showResolved
                  ? t("_pages:feedback.hideResolved")
                  : t("_pages:feedback.showResolved", {
                      count: resolved.length,
                    })}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
