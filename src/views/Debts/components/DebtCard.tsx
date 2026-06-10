import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { classNames } from "@sito/dashboard-app";

import { ItemCard, ItemCardTitle } from "components";

import { Currency } from "views/Currencies/components/Currency";

import { DEBT_DIRECTION_NAME, DEBT_STATUS_NAME, DebtStatus } from "lib";

import { DEBT_STATUS_BADGE_CLASSNAME } from "../constants";
import type { DebtCardPropsType } from "../types";

import "./styles.css";

export function DebtCard(props: DebtCardPropsType) {
  const { t } = useTranslation();

  const {
    id,
    title,
    counterpartyName,
    description,
    currency,
    direction,
    status,
    originalAmount,
    pendingAmount,
    dueAt,
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

  const dueLabel = useMemo(() => {
    if (!dueAt) return t("_pages:debts.labels.noDueDate");

    const date = new Date(dueAt);
    if (Number.isNaN(date.getTime())) return dueAt;

    return date.toLocaleDateString();
  }, [dueAt, t]);

  return (
    <ItemCard
      title={
        <div className="debt-card-title-row">
          <ItemCardTitle>{title}</ItemCardTitle>
          <span className="debt-card-amount">
            {status === DebtStatus.Paid ? (
              <s className="debt-card-amount--paid">{originalAmount}</s>
            ) : (
              pendingAmount
            )}{" "}
            <Currency name={currency?.name} symbol={currency?.symbol} />
          </span>
        </div>
      }
      deleted={!!deletedAt}
      name={t("_pages:debts.forms.edit")}
      aria-label={t("_pages:debts.forms.editAria")}
      onClick={() => onClick(id)}
      selectionMode={selectionMode}
      selected={selected}
      onToggleSelection={() => onSelect?.(id)}
      onLongPressSelection={() => onLongPress?.(id)}
      actions={actions}
      swipeDeleteOpen={swipeDeleteOpen}
      onSwipeDelete={onSwipeDelete}
      className="debt-card-content"
      containerClassName={classNames(
        status === DebtStatus.Paid && "debt-card-content--paid",
      )}
    >
      <p
        className={classNames(
          "debt-card-description",
          !description && "debt-card-description--empty",
        )}
      >
        {parsedDescription}
      </p>
      <p className="debt-card-meta">
        {t("_entities:debt.counterpartyName.label")}: {counterpartyName ?? "-"}
      </p>
      <p className="debt-card-meta">
        {t("_entities:debt.direction.label")}:{" "}
        {t(`_entities:debt.direction.values.${DEBT_DIRECTION_NAME[direction]}`)}
      </p>
      <p className="debt-card-meta">
        {t("_entities:debt.originalAmount.label")}: {originalAmount}{" "}
        <Currency name={currency?.name} symbol={currency?.symbol} />
      </p>
      <p className="debt-card-meta">
        {t("_entities:debt.dueAt.label")}: {dueLabel}
      </p>
      <span
        className={classNames(
          "debt-card-status",
          DEBT_STATUS_BADGE_CLASSNAME[status],
        )}
      >
        {t(`_entities:debt.status.values.${DEBT_STATUS_NAME[status]}`)}
      </span>
    </ItemCard>
  );
}
