import { QueryParam, SortOrder } from "@sito/dashboard-app";

import { TransactionDto } from "lib";

export const WEEKLY_TRANSACTIONS_LIST_QUERY: QueryParam<TransactionDto> = {
  currentPage: 0,
  pageSize: 100,
  sortingBy: "date",
  sortingOrder: SortOrder.DESC,
};
