import type { UpdateDashboardCardConfigDto } from "lib";

import type { LastTransactionsFormType } from "./types";
import {
  defaultConfig,
  MAX_LAST_TRANSACTIONS_LIMIT,
  MIN_LAST_TRANSACTIONS_LIMIT,
} from "./constants";

export const clampLimit = (value: unknown): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return defaultConfig.limit;
  return Math.min(
    MAX_LAST_TRANSACTIONS_LIMIT,
    Math.max(MIN_LAST_TRANSACTIONS_LIMIT, Math.round(parsed)),
  );
};

export const formToDto = (
  data: LastTransactionsFormType,
): UpdateDashboardCardConfigDto => {
  const categories = data.categories ?? [];
  const stringified = JSON.stringify({
    account: data.account,
    categories,
    categoryIds: categories.map((category) => category.id),
    limit: clampLimit(data.limit),
    showFiltersAsBadge: !!data.showFiltersAsBadge,
  });
  return {
    userId: data.userId,
    id: data.id,
    config: stringified,
  };
};

export const parseFormConfig = (
  cfg?: string | null,
): LastTransactionsFormType => {
  try {
    const parsed = (cfg ? JSON.parse(cfg) : {}) as LastTransactionsFormType;
    const merged = { ...defaultConfig, ...parsed };
    const categories = merged.categories ?? [];
    return {
      ...merged,
      categories,
      categoryIds: categories.map((category) => category.id),
      limit: clampLimit(merged.limit),
    };
  } catch (err) {
    console.error(err);
    return defaultConfig;
  }
};

export const getActiveFiltersCount = (
  formConfig: LastTransactionsFormType,
): number =>
  (formConfig.account ? 1 : 0) + (formConfig.categories?.length ? 1 : 0);
