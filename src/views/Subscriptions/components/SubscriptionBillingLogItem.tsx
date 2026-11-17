import { useTranslation } from "react-i18next";

import { RAW_INTERPOLATION } from "../constants";
import { formatBillingLogPaidAt, getBillingLogAmountLabel } from "../utils";
import type { SubscriptionBillingLogItemPropsType } from "../types";

export function SubscriptionBillingLogItem(
  props: SubscriptionBillingLogItemPropsType,
) {
  const { log, onClick } = props;
  const { t } = useTranslation();

  const amount = getBillingLogAmountLabel(log);
  const paidAt = formatBillingLogPaidAt(log.paidAt);
  const transactionId = log.transactionId ?? null;

  const content = (
    <>
      <span className="subscription-activity-amount">{amount}</span>
      <span className="subscription-activity-meta">
        {t("_entities:subscriptionBillingLog.paidAt.label")}: {paidAt}
      </span>
      {log.note ? (
        <span className="subscription-activity-note">{log.note}</span>
      ) : null}
    </>
  );

  if (transactionId === null || !onClick) {
    return <li className="subscription-activity-item">{content}</li>;
  }

  return (
    <li>
      <button
        type="button"
        className="subscription-activity-item clickable"
        aria-label={t(
          "_pages:subscriptions.actions.billingLog.openTransaction",
          {
            amount,
            paidAt,
            interpolation: RAW_INTERPOLATION,
          },
        )}
        onClick={() => onClick(transactionId)}
      >
        {content}
      </button>
    </li>
  );
}
