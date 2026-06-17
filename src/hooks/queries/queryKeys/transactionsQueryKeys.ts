import type { QueryParam } from "@sito/dashboard-app";

import type {
  FilterTransactionGroupedByTypeDto,
  FilterTransactionDto,
  TransactionTypeResumeBatchRequestItemDto,
  FilterTransactionTypeResumeDto,
  FilterWeeklyTransactionDto,
  TransactionDto,
} from "lib";

export const TransactionsQueryKeys = {
  all: () => ({
    queryKey: ["transactions"],
  }),
  list: (query: QueryParam<TransactionDto>, filters: FilterTransactionDto) => ({
    queryKey: [...TransactionsQueryKeys.all().queryKey, "list", query, filters],
  }),
  infiniteList: (
    query: Omit<QueryParam<TransactionDto>, "currentPage">,
    filters: FilterTransactionDto,
  ) => ({
    queryKey: [
      ...TransactionsQueryKeys.all().queryKey,
      "infinite-list",
      query,
      filters,
    ],
  }),
  common: (filters: FilterTransactionDto) => ({
    queryKey: [...TransactionsQueryKeys.all().queryKey, "common", filters],
  }),
  typeResume: (filters: FilterTransactionTypeResumeDto) => ({
    queryKey: [...TransactionsQueryKeys.all().queryKey, "typeResume", filters],
    enabled: !!filters.accountId && filters.type !== undefined,
  }),
  typeResumeBatch: (items: TransactionTypeResumeBatchRequestItemDto[]) => ({
    queryKey: [
      ...TransactionsQueryKeys.all().queryKey,
      "typeResumeBatch",
      items,
    ],
    enabled: items.length > 0,
  }),
  weekly: (filters: FilterWeeklyTransactionDto) => ({
    queryKey: [...TransactionsQueryKeys.all().queryKey, "weekly", filters],
    enabled: Array.isArray(filters.account) && filters.account.length > 0,
  }),
  groupedByType: (filters: FilterTransactionGroupedByTypeDto) => ({
    queryKey: [
      ...TransactionsQueryKeys.all().queryKey,
      "groupedByType",
      filters,
    ],
    enabled: !!filters.accountId,
  }),
};
