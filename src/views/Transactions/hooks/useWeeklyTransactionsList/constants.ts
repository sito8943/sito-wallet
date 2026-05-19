import type { QueryParam } from "@sito/dashboard-app";
import { SortOrder } from "@sito/dashboard-app";

import type { TransactionDto } from "lib";

export const WEEKLY_TRANSACTIONS_LIST_QUERY: QueryParam<TransactionDto> = {
  currentPage: 0,
  pageSize: 100,
  sortingBy: "date",
  sortingOrder: SortOrder.DESC,
};
