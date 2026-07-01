import type { LastTransactionsFormType } from "./types";

export const DEFAULT_LAST_TRANSACTIONS_LIMIT = 4;
export const MIN_LAST_TRANSACTIONS_LIMIT = 1;
export const MAX_LAST_TRANSACTIONS_LIMIT = 10;

export const defaultConfig: LastTransactionsFormType = {
  account: null,
  categories: [],
  categoryIds: [],
  limit: DEFAULT_LAST_TRANSACTIONS_LIMIT,
  showFiltersAsBadge: false,
};
