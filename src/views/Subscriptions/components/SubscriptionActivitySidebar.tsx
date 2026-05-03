import { Loading } from "@sito/dashboard-app";
import { useTranslation } from "react-i18next";

import { SubscriptionActivitySidebarPropsType } from "../types";

export function SubscriptionActivitySidebar(
  props: SubscriptionActivitySidebarPropsType,
) {
  const { t } = useTranslation();

  const {
    startsAt,
    lastPaidAt,
    nextRenewalAt,
    billingLogs,
    billingLogsLoading,
    billingLogsError,
  } = props;

  const formatDateTime = (value?: string | null): string => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString();
  };

  const startsAtLabel = formatDateTime(startsAt);
  const lastPaidAtLabel = formatDateTime(lastPaidAt);
  const nextRenewalAtLabel = nextRenewalAt
    ? formatDateTime(nextRenewalAt)
    : t("_pages:subscriptions.labels.noRenewal");

  const billingLogsErrorMessage =
    billingLogsError instanceof Error
      ? billingLogsError.message
      : typeof billingLogsError === "object" &&
          billingLogsError !== null &&
          "message" in billingLogsError &&
          typeof billingLogsError.message === "string"
        ? billingLogsError.message
        : t("_accessibility:errors.500");

  return (
    <aside className="subscription-editor-sidebar">
      <section className="subscription-activity-section">
        <ul className="subscription-activity-list">
          <li className="subscription-activity-item">
            <p className="subscription-activity-meta">
              {t("_entities:subscription.startsAt.label")}: {startsAtLabel}
            </p>
            <p className="subscription-activity-meta">
              {t("_entities:subscription.lastPaidAt.label")}: {lastPaidAtLabel}
            </p>
          </li>
        </ul>
      </section>

      <section className="subscription-activity-section">
        <h3 className="subscription-activity-section-title">
          {t("_pages:subscriptions.labels.nextRenewal")}
        </h3>
        <ul className="subscription-activity-list">
          <li className="subscription-activity-item">
            <p className="subscription-activity-meta">{nextRenewalAtLabel}</p>
          </li>
        </ul>
      </section>

      <section className="subscription-activity-section">
        <h3 className="subscription-activity-section-title">
          {t("_pages:subscriptions.actions.billingLog.title")}
        </h3>

        {billingLogsLoading ? (
          <Loading className="subscription-activity-loading" />
        ) : billingLogsError ? (
          <p className="subscription-activity-error">
            {billingLogsErrorMessage}
          </p>
        ) : billingLogs.length ? (
          <ul className="subscription-activity-list">
            {billingLogs.map((log) => {
              const paidAtDate = new Date(log.paidAt);
              const paidAt = Number.isNaN(paidAtDate.getTime())
                ? log.paidAt
                : paidAtDate.toLocaleString();
              const currencyLabel =
                log.currency?.symbol ?? log.currency?.name ?? "";

              return (
                <li key={log.id} className="subscription-activity-item">
                  <p className="subscription-activity-amount">
                    {log.amount}
                    {currencyLabel ? ` ${currencyLabel}` : ""}
                  </p>
                  <p className="subscription-activity-meta">
                    {t("_entities:subscriptionBillingLog.paidAt.label")}:{" "}
                    {paidAt}
                  </p>
                  {log.note ? (
                    <p className="subscription-activity-note">{log.note}</p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="subscription-activity-empty">
            {t("_accessibility:messages.empty")}
          </p>
        )}
      </section>
    </aside>
  );
}
