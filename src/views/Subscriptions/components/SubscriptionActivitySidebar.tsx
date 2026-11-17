import { Loading } from "@sito/dashboard-app";
import { useTranslation } from "react-i18next";

import { QueryError } from "components";

import { formatDate, formatDateTime } from "lib";

import type { SubscriptionActivitySidebarPropsType } from "../types";

import { SubscriptionBillingLogItem } from "./SubscriptionBillingLogItem";

export function SubscriptionActivitySidebar(
  props: SubscriptionActivitySidebarPropsType,
) {
  const { t, i18n } = useTranslation();

  const {
    startsAt,
    lastPaidAt,
    nextRenewalAt,
    billingLogs,
    billingLogsLoading,
    billingLogsError,
    onBillingLogClick,
    onDeleteBillingLog,
  } = props;

  const startsAtLabel = formatDate(startsAt, i18n.language);
  const lastPaidAtLabel = formatDateTime(lastPaidAt, i18n.language);
  const nextRenewalAtLabel = formatDate(nextRenewalAt, i18n.language);

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
            <p className="subscription-activity-meta">
              {t("_entities:subscription.nextRenewalAt.label")}:{" "}
              {nextRenewalAtLabel}
            </p>
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
          <QueryError compact error={billingLogsError} />
        ) : billingLogs.length ? (
          <ul className="subscription-activity-list">
            {billingLogs.map((log) => (
              <SubscriptionBillingLogItem
                key={log.id}
                log={log}
                onClick={onBillingLogClick}
                onDelete={onDeleteBillingLog}
              />
            ))}
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
