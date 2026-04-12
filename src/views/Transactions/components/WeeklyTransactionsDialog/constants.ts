import { SortOrder } from "@sito/dashboard-app";

export const WEEKLY_TRANSACTIONS_DIALOG_CLASS_NAME =
  "w-11/12 md:w-4/5 max-w-[1100px]";

export const WEEKLY_TRANSACTIONS_TABLE_INITIAL_STATE = {
  currentPage: 0,
  pageSize: 100,
  pageSizes: [100] as number[],
  sortingBy: "date",
  sortingOrder: SortOrder.DESC,
} as const;
