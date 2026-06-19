import type { FilterTransactionDto, TransactionDto } from "lib";

export type RecentTransactionsDialogPropsType = {
  open: boolean;
  onClose: () => void;
  title: string;
  filters: FilterTransactionDto;
  excludedCategoryIds?: number[];
  enabled?: boolean;
};

export type UseRecentTransactionsPropsType = Pick<
  RecentTransactionsDialogPropsType,
  "open" | "filters" | "excludedCategoryIds" | "enabled"
>;

export type RecentTransactionItemPropsType = {
  transaction: TransactionDto;
};
