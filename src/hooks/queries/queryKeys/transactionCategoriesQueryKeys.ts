import { QueryParam } from "@sito/dashboard-app";

import {
  FilterTransactionCategoryDto,
  TransactionCategoryDto,
} from "lib";

export const TransactionCategoriesQueryKeys = {
  all: () => ({
    queryKey: ["transaction-categories"],
  }),
  list: (filters: FilterTransactionCategoryDto) => ({
    queryKey: [
      ...TransactionCategoriesQueryKeys.all().queryKey,
      "list",
      filters,
    ],
  }),
  infiniteList: (
    query: Omit<QueryParam<TransactionCategoryDto>, "currentPage">,
    filters: FilterTransactionCategoryDto,
  ) => ({
    queryKey: [
      ...TransactionCategoriesQueryKeys.all().queryKey,
      "infinite-list",
      query,
      filters,
    ],
  }),
  common: () => ({
    queryKey: [...TransactionCategoriesQueryKeys.all().queryKey, "common"],
  }),
};
