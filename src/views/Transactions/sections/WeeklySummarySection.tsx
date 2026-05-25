import { useTranslation } from "react-i18next";

import { TransactionType } from "lib";

import { WeeklyCard } from "../components/WeeklyCard";
import type { WeeklySummarySectionProps } from "./types";

import "../styles.css";

export const WeeklySummarySection = (props: WeeklySummarySectionProps) => {
  const { selectedAccount, onOpenWeeklyTransactions } = props;
  const { t } = useTranslation();

  if (!selectedAccount) return null;

  return (
    <div className="transactions-weekly-summary">
      <WeeklyCard
        type={TransactionType.Out}
        title={t("_pages:transactions.cards.weeklySpent.title")}
        accountId={selectedAccount.id}
        currencyName={selectedAccount.currency?.name}
        currencySymbol={selectedAccount.currency?.symbol}
        onOpenTransactions={onOpenWeeklyTransactions}
      />
      <WeeklyCard
        type={TransactionType.In}
        title={t("_pages:transactions.cards.weeklyIncoming.title")}
        accountId={selectedAccount.id}
        currencyName={selectedAccount.currency?.name}
        currencySymbol={selectedAccount.currency?.symbol}
        onOpenTransactions={onOpenWeeklyTransactions}
      />
    </div>
  );
};

export default WeeklySummarySection;
