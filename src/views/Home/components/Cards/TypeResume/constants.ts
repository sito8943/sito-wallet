import type { QueryParam } from "@sito/dashboard-app";
import { SortOrder } from "@sito/dashboard-app";

import { TransactionType, TransactionTypeResumeTime } from "lib";
import type { TransactionDto } from "lib";

import type { TypeResumeTypeFormType } from "./types";

export const DEFAULT_TYPE_RESUME_CONFIG: TypeResumeTypeFormType = {
  type: TransactionType.In,
  time: TransactionTypeResumeTime.CurrentMonth,
};

export const TYPE_RESUME_TRANSACTIONS_LIST_QUERY: QueryParam<TransactionDto> = {
  currentPage: 0,
  pageSize: 100,
  sortingBy: "date",
  sortingOrder: SortOrder.DESC,
};
