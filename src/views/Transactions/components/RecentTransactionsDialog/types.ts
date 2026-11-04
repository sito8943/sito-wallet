import type { FilterTransactionDto } from "lib";

export type RecentTransactionsDialogPropsType = {
  open: boolean;
  onClose: () => void;
  title: string;
  filters: FilterTransactionDto;
  excludedCategoryIds?: number[];
  enabled?: boolean;
  /** Max transactions shown, newest first. Defaults to the recent limit. */
  limit?: number;
  /** Replaces the default "no transactions for these filters" text. */
  emptyMessage?: string;
};

export type UseRecentTransactionsPropsType = Pick<
  RecentTransactionsDialogPropsType,
  "open" | "filters" | "excludedCategoryIds" | "enabled" | "limit"
>;
