import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { classNames } from "@sito/dashboard-app";

// lib
import { TransactionType } from "lib";

// hooks
import { useWeekly } from "hooks";

// components
import { Currency } from "../../Currencies";
import { BaseCard } from "../../Home/components/Cards/BaseCard";

// types
import type { WeeklyCardProps } from "./types";

import "./styles.css";

export const WeeklyCard = (props: WeeklyCardProps) => {
  const {
    accountId,
    currencyName,
    currencySymbol,
    title,
    type,
    onOpenTransactions,
  } = props;
  const { t } = useTranslation();

  const { data, isLoading } = useWeekly({
    type,
    account: accountId ? [accountId] : undefined,
  });

  const difference = useMemo(() => {
    if (data) return Math.floor(data?.currentWeek - data?.previousWeek);
    return 0;
  }, [data]);
  const symbol = currencySymbol ?? data?.account?.currency?.symbol ?? "";
  const name = currencyName ?? data?.account?.currency?.name ?? "";
  const canOpenTransactions = !!onOpenTransactions;
  const currentValueClassName =
    type === TransactionType.Out
      ? "weekly-card-current--expense"
      : "weekly-card-current--income";
  const differenceClassName =
    difference > 0
      ? type === TransactionType.Out
        ? "weekly-card-difference--expense-up"
        : "weekly-card-difference--income-up"
      : type === TransactionType.Out
        ? "weekly-card-difference--expense-down"
        : "weekly-card-difference--income-down";

  const handleOpenTransactions = useCallback(() => {
    onOpenTransactions?.(type);
  }, [onOpenTransactions, type]);

  return (
    <BaseCard className="weekly-card">
      <button
        type="button"
        onClick={handleOpenTransactions}
        disabled={!canOpenTransactions}
        aria-label={title}
        className={classNames(
          "weekly-card-button",
          canOpenTransactions
            ? "weekly-card-button--interactive"
            : "weekly-card-button--disabled",
        )}
      >
        <div className="weekly-card-content">
          <h3 className="weekly-card-title poppins">{title}</h3>
          <div className="weekly-card-values">
            <p
              className={classNames(
                "weekly-card-current poppins",
                currentValueClassName,
              )}
            >
              {isLoading ? "…" : data?.currentWeek}{" "}
              <Currency name={name} symbol={symbol} />
            </p>
            {!!difference && !!data?.previousWeek && (
              <p
                className={classNames(
                  "weekly-card-difference poppins",
                  differenceClassName,
                )}
              >
                <span
                  data-tooltip-id="tooltip"
                  data-tooltip-content={String(data?.previousWeek)}
                >
                  {difference > 0 ? "+" : ""}
                  {isLoading ? "…" : difference}{" "}
                </span>
                <span>{t("_pages:transactions.cards.lastWeek")}</span>
              </p>
            )}
          </div>
        </div>
      </button>
    </BaseCard>
  );
};
