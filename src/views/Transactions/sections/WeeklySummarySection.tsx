import { useTranslation } from "react-i18next";

import { TransactionType } from "lib";

import { WeeklyCard } from "../components/WeeklyCard";
import type { WeeklySummarySectionProps } from "./types";

export const WeeklySummarySection = (props: WeeklySummarySectionProps) => {
  const { selectedAccount, onOpenWeeklyTransactions } = props;
  const { t } = useTranslation();

  if (!selectedAccount) return null;

  return (
    <div className="mb-4 grid grid-cols-2 gap-4 max-md:grid-cols-1 max-sm:hidden">
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
