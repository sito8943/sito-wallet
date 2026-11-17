import { useTranslation } from "react-i18next";

import { IconButton } from "@sito/dashboard-app";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { RAW_INTERPOLATION } from "../constants";
import { ActivityItem, Money } from "components";

import {
  formatBillingLogPaidAt,
  getBillingLogAmountLabel,
  getBillingLogCurrency,
} from "../utils";
import type { SubscriptionBillingLogItemPropsType } from "../types";

export function SubscriptionBillingLogItem(
  props: SubscriptionBillingLogItemPropsType,
) {
  const { log, onClick, onDelete } = props;
  const { t, i18n } = useTranslation();

  const amount = getBillingLogAmountLabel(log, i18n.language);
  const paidAt = formatBillingLogPaidAt(log.paidAt, i18n.language);
  const transactionId = log.transactionId ?? null;
  const clickable = transactionId !== null && !!onClick;

  return (
    <ActivityItem
      amount={
        <Money amount={log.amount} currency={getBillingLogCurrency(log)} />
      }
      meta={`${t("_entities:subscriptionBillingLog.paidAt.label")}: ${paidAt}`}
      note={log.note}
      onClick={clickable ? () => onClick(transactionId) : undefined}
      aria-label={
        clickable
          ? t("_pages:subscriptions.actions.billingLog.openTransaction", {
              amount,
              paidAt,
              interpolation: RAW_INTERPOLATION,
            })
          : undefined
      }
      actions={
        onDelete ? (
          <IconButton
            icon={faTrash}
            color="error"
            onClick={() => onDelete(log)}
            aria-label={t("_pages:subscriptions.actions.deleteBillingLog.text")}
          />
        ) : null
      }
    />
  );
}
