import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ItemCard, ItemCardTitle } from "components";

import { Currency } from "views/Currencies/components/Currency";

import { SUBSCRIPTION_STATUS_BADGE_CLASSNAME } from "../constants";
import { SubscriptionCardPropsType } from "../types";
import { toSubscriptionStatus } from "../utils";

export function SubscriptionCard(props: SubscriptionCardPropsType) {
  const { t } = useTranslation();

  const {
    id,
    name,
    description,
    provider,
    currency,
    amount,
    status,
    nextRenewalAt,
    deletedAt,
    actions,
    onClick,
    selectionMode,
    selected,
    onSelect,
    onLongPress,
  } = props;

  const parsedDescription = description || t("_entities:base.description.empty");

  const parsedStatus = toSubscriptionStatus(status);

  const renewalLabel = useMemo(() => {
    if (!nextRenewalAt) return t("_pages:subscriptions.labels.noRenewal");

    const date = new Date(nextRenewalAt);
    if (Number.isNaN(date.getTime())) return nextRenewalAt;

    return date.toLocaleDateString();
  }, [nextRenewalAt, t]);

  return (
    <ItemCard
      title={
        <div className="flex w-full items-start justify-between gap-2">
          <ItemCardTitle>{name}</ItemCardTitle>
          <span className="text-sm font-semibold whitespace-nowrap">
            {amount} <Currency name={currency?.name} symbol={currency?.symbol} />
          </span>
        </div>
      }
      deleted={!!deletedAt}
      name={t("_pages:subscriptions.forms.edit")}
      aria-label={t("_pages:subscriptions.forms.editAria")}
      onClick={() => onClick(id)}
      selectionMode={selectionMode}
      selected={selected}
      onToggleSelection={() => onSelect?.(id)}
      onLongPressSelection={() => onLongPress?.(id)}
      actions={actions}
      className="gap-2"
    >
      <p className={`${description ? "" : "italic text-xs"} text-start`}>
        {parsedDescription}
      </p>
      <p className="text-sm text-text-muted text-start">
        {t("_entities:subscription.provider.label")}: {provider?.name ?? "-"}
      </p>
      <p className="text-sm text-text-muted text-start">
        {t("_pages:subscriptions.labels.nextRenewal")}: {renewalLabel}
      </p>
      <span
        className={`inline-flex w-fit rounded-full px-2 py-0.5 text-xs ${SUBSCRIPTION_STATUS_BADGE_CLASSNAME[parsedStatus]}`}
      >
        {t(`_entities:subscription.status.values.${parsedStatus}`)}
      </span>
    </ItemCard>
  );
}
