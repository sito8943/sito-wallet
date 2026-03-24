import { useTranslation } from "react-i18next";

import { TransactionType, AccountDto } from "lib";

import { WeeklyCard } from "../components/WeeklyCard";

type WeeklySummarySectionProps = {
  selectedAccount?: AccountDto | null;
};

export const WeeklySummarySection = (props: WeeklySummarySectionProps) => {
  const { selectedAccount } = props;
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
      />
      <WeeklyCard
        type={TransactionType.In}
        title={t("_pages:transactions.cards.weeklyIncoming.title")}
        accountId={selectedAccount.id}
        currencyName={selectedAccount.currency?.name}
        currencySymbol={selectedAccount.currency?.symbol}
      />
    </div>
  );
};

export default WeeklySummarySection;
