import { AccountDto, TransactionType } from "lib";

export type WeeklyCardProps = {
  accountId?: number | null;
  currencyName?: string;
  currencySymbol?: string;
  title: string;
  type: TransactionType;
  onOpenTransactions?: (type: TransactionType) => void;
};

export type AccountCarouselPropsType = {
  className?: string;
  accounts: AccountDto[];
  selectedAccount?: AccountDto | null;
  isLoading?: boolean;
  error: Error | null;
  onAccountChange: (accountId: number) => void;
  onOpenFilters?: () => void;
};
