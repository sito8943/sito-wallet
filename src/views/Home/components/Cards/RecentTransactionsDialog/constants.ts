import type { QueryParam } from "@sito/dashboard-app";
import { SortOrder } from "@sito/dashboard-app";

import type { TransactionDto } from "lib";

export const RECENT_TRANSACTIONS_LIMIT = 10;
export const RECENT_TRANSACTIONS_PREFILTER_LIMIT = 100;

export const RECENT_TRANSACTIONS_DIALOG_CLASS_NAME =
  "recent-transactions-dialog w-11/12 md:w-4/5 max-w-[1100px]";

export const RECENT_TRANSACTIONS_QUERY: QueryParam<TransactionDto> = {
  currentPage: 0,
  pageSize: RECENT_TRANSACTIONS_LIMIT,
  sortingBy: "date",
  sortingOrder: SortOrder.DESC,
};

export const RECENT_TRANSACTIONS_PREFILTER_QUERY: QueryParam<TransactionDto> = {
  ...RECENT_TRANSACTIONS_QUERY,
  pageSize: RECENT_TRANSACTIONS_PREFILTER_LIMIT,
};
