import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { classNames } from "@sito/dashboard-app";

import { ItemCard, ItemCardTitle } from "components";

import { Currency } from "views/Currencies/components/Currency";

import { SUBSCRIPTION_STATUS_BADGE_CLASSNAME } from "../constants";
import type { SubscriptionCardPropsType } from "../types";
import { toSubscriptionStatus } from "../utils";

import "./styles.css";

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
    swipeDeleteOpen,
    onSwipeDelete,
  } = props;

  const parsedDescription =
    description || t("_entities:base.description.empty");

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
        <div className="subscription-card-title-row">
          <ItemCardTitle>{name}</ItemCardTitle>
          <span className="subscription-card-amount">
            {amount}{" "}
            <Currency name={currency?.name} symbol={currency?.symbol} />
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
      swipeDeleteOpen={swipeDeleteOpen}
      onSwipeDelete={onSwipeDelete}
      className="subscription-card-content"
    >
      <p
        className={classNames(
          "subscription-card-description",
          !description && "subscription-card-description--empty",
        )}
      >
        {parsedDescription}
      </p>
      <p className="subscription-card-meta">
        {t("_entities:subscription.provider.label")}: {provider?.name ?? "-"}
      </p>
      <p className="subscription-card-meta">
        {t("_pages:subscriptions.labels.nextRenewal")}: {renewalLabel}
      </p>
      <span
        className={classNames(
          "subscription-card-status",
          SUBSCRIPTION_STATUS_BADGE_CLASSNAME[parsedStatus],
        )}
      >
        {t(`_entities:subscription.status.values.${parsedStatus}`)}
      </span>
    </ItemCard>
  );
}
