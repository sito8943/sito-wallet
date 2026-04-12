import type { TabsType } from "@sito/dashboard-app";
import type { AccountDto, TransactionType } from "lib";

export type TransactionsDesktopSectionProps = {
  tabValue?: number;
  tabs: TabsType[];
};

export type TransactionsMobileSectionProps = {
  accounts: AccountDto[];
  selectedAccount?: AccountDto | null;
  isAccountLoading?: boolean;
  accountError: Error | null;
  onAccountChange: (accountId: number) => void;
  onOpenFilters: () => void;
  tabValue?: number;
  tabs: TabsType[];
};

export type WeeklySummarySectionProps = {
  selectedAccount?: AccountDto | null;
  onOpenWeeklyTransactions?: (type: TransactionType) => void;
};
