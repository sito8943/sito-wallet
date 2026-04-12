import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

// lib
import { TransactionType } from "lib";

// hooks
import { useWeekly } from "hooks";

// components
import { Currency } from "../../Currencies";
import { BaseCard } from "../../Home/components/Cards/BaseCard";

// types
import { WeeklyCardProps } from "./types";

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

  const handleOpenTransactions = useCallback(() => {
    onOpenTransactions?.(type);
  }, [onOpenTransactions, type]);

  return (
    <BaseCard className="!h-auto !py-2 ">
      <button
        type="button"
        onClick={handleOpenTransactions}
        disabled={!canOpenTransactions}
        aria-label={title}
        className={`w-full text-left ${
          canOpenTransactions
            ? "cursor-pointer transition hover:opacity-80"
            : "cursor-default disabled:opacity-100"
        }`}
      >
        <div className="flex flex-col gap-2 w-full">
          <h3 className="text-lg poppins">{title}</h3>
          <div className="flex flex-wrap gap-1 items-end">
            <p
              className={`text-2xl font-bold self-start poppins ${
                type === TransactionType.Out ? "text-bg-error" : "text-bg-success"
              }`}
            >
              {isLoading ? "…" : data?.currentWeek}{" "}
              <Currency name={name} symbol={symbol} />
            </p>
            {!!difference && !!data?.previousWeek && (
              <p
                className={`text-sm font-bold self-start poppins ${
                  difference > 0
                    ? `${
                        type === TransactionType.Out
                          ? "text-bg-error"
                          : "text-bg-success"
                      }`
                    : `${
                        type === TransactionType.Out
                          ? "text-bg-success"
                          : "text-bg-error"
                      }`
                }`}
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
