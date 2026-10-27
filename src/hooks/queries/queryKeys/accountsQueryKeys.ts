import type { QueryParam } from "@sito/dashboard-app";

import type {
  AccountDto,
  FilterAccountDto,
  FilterBalanceHistoryDto,
  FilterSavingsProjectionDailyDto,
  FilterSavingsProjectionDto,
  GetAccountByIdQueryDto,
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
  common: (filters: FilterAccountDto) => ({
    queryKey: [...AccountsQueryKeys.all().queryKey, "common", filters],
  }),
  byId: (id: number | undefined, query: GetAccountByIdQueryDto) => ({
    queryKey: [...AccountsQueryKeys.all().queryKey, "by-id", id, query],
  }),
  balanceHistory: (filters: FilterBalanceHistoryDto) => ({
    queryKey: [...AccountsQueryKeys.all().queryKey, "balance-history", filters],
    enabled: !!filters.accountId && !!filters.from && !!filters.to,
  }),
  // Nested under "accounts" so every account/transaction mutation that
  // invalidates `AccountsQueryKeys.all()` also refreshes the projections.
  savingsProjectionAll: () => ({
    queryKey: [...AccountsQueryKeys.all().queryKey, "savings-projection"],
  }),
  savingsProjection: (filters: FilterSavingsProjectionDto) => ({
    queryKey: [...AccountsQueryKeys.savingsProjectionAll().queryKey, filters],
    enabled: !!filters.accountId && !!filters.horizon,
  }),
  savingsProjectionDaily: (filters: FilterSavingsProjectionDailyDto) => ({
    queryKey: [
      ...AccountsQueryKeys.savingsProjectionAll().queryKey,
      "daily",
      filters,
    ],
    enabled: !!filters.accountId && !!filters.month,
  }),
};
