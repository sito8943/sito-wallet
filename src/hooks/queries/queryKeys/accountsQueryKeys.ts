import type { QueryParam } from "@sito/dashboard-app";

import type {
  AccountDto,
  FilterAccountDto,
  FilterBalanceHistoryDto,
} from "lib";

export const AccountsQueryKeys = {
  all: () => ({
    queryKey: ["accounts"],
  }),
  list: (
    query: Omit<QueryParam<AccountDto>, "currentPage">,
    filters: FilterAccountDto,
  ) => ({
    queryKey: [...AccountsQueryKeys.all().queryKey, "list", query, filters],
  }),
  infiniteList: (
    query: Omit<QueryParam<AccountDto>, "currentPage">,
    filters: FilterAccountDto,
  ) => ({
    queryKey: [
      ...AccountsQueryKeys.all().queryKey,
      "infinite-list",
      query,
      filters,
    ],
  }),
  common: () => ({
    queryKey: [...AccountsQueryKeys.all().queryKey, "common"],
  }),
  balanceHistory: (filters: FilterBalanceHistoryDto) => ({
    queryKey: [...AccountsQueryKeys.all().queryKey, "balance-history", filters],
    enabled: !!filters.accountId && !!filters.from && !!filters.to,
  }),
};
