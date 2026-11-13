import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Page } from "@sito/dashboard-app";

// hooks
import { FeedbackQueryKeys, useFeedbackList, useMobileNavbar } from "hooks";

// components
import { FeedbackSection } from "./components";

// hooks
import { useSetFeedbackResolved } from "./hooks";

import "./styles.css";

/**
 * Admin inbox of what users told their AI agent (or the app) that fails, is
 * missing or could be better.
 */
export function Feedback() {
  const { t } = useTranslation();
  const title = t("_pages:feedback.title");

  const feedbackQuery = useFeedbackList();
  const { toggleResolved, pendingId } = useSetFeedbackResolved();

  useMobileNavbar(title);

  return (
    <Page title={title} queryKey={FeedbackQueryKeys.all().queryKey}>
      <div className="feedback-view">
        <p className="feedback-muted">{t("_pages:feedback.hint")}</p>
        <FeedbackSection
          entries={feedbackQuery.data ?? []}
          isLoading={feedbackQuery.isLoading}
          hasError={!!feedbackQuery.error}
          onRetry={() => void feedbackQuery.refetch()}
          onToggleResolved={toggleResolved}
          pendingId={pendingId}
        />
      </div>
    </Page>
  );
}
