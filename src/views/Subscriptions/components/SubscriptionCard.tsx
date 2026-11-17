import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { classNames } from "@sito/dashboard-app";

import { ItemCard, ItemCardTitle, Money } from "components";

import { formatDate } from "lib";

import { SUBSCRIPTION_STATUS_BADGE_CLASSNAME } from "../constants";
import type { SubscriptionCardPropsType } from "../types";
import { toSubscriptionStatus } from "../utils";

import "./styles.css";

export function SubscriptionCard(props: SubscriptionCardPropsType) {
  const { t, i18n } = useTranslation();

  const {
    id,
    name,
    description,
    provider,
    purchaseProvider,
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

  const parsedStatus = toSubscriptionStatus(status);

  const renewalLabel = useMemo(() => {
    if (!nextRenewalAt) return t("_pages:subscriptions.labels.noRenewal");

    return formatDate(nextRenewalAt, i18n.language);
  }, [i18n.language, nextRenewalAt, t]);

  return (
    <ItemCard
      title={
        <div className="subscription-card-title-row">
          <ItemCardTitle>{name}</ItemCardTitle>
          <span className="subscription-card-amount">
            <Money amount={amount} currency={currency} />
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
      {description ? (
        <p className="subscription-card-description">{description}</p>
      ) : null}
      <p className="subscription-card-meta">
        {t("_entities:subscription.provider.label")}: {provider?.name ?? "-"}
      </p>
      {purchaseProvider ? (
        <p className="subscription-card-meta">
          {t("_entities:subscription.purchaseProvider.label")}:{" "}
          {purchaseProvider.name}
        </p>
      ) : null}
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
