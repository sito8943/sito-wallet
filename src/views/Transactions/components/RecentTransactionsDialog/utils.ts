import type { QueryParam } from "@sito/dashboard-app";

import { getTransactionCategories, isFiniteNumber } from "lib";
import type { TransactionDto } from "lib";

import {
  RECENT_TRANSACTIONS_LIMIT,
  RECENT_TRANSACTIONS_PREFILTER_QUERY,
  RECENT_TRANSACTIONS_QUERY,
} from "./constants";

export const normalizeRecentExcludedCategoryIds = (
  value: number[] | undefined,
): number[] => {
  if (!Array.isArray(value)) return [];

  return [...new Set(value.map(Number).filter(isFiniteNumber))].sort(
    (left, right) => left - right,
  );
};

export const getRecentTransactionsQuery = (
  excludedCategoryIds: number[],
  limit: number = RECENT_TRANSACTIONS_LIMIT,
): QueryParam<TransactionDto> => {
  const base = excludedCategoryIds.length
    ? RECENT_TRANSACTIONS_PREFILTER_QUERY
    : RECENT_TRANSACTIONS_QUERY;
  return { ...base, pageSize: Math.max(base.pageSize ?? limit, limit) };
};

export const filterRecentTransactions = (
  transactions: TransactionDto[],
  excludedCategoryIds: number[],
  limit: number = RECENT_TRANSACTIONS_LIMIT,
): TransactionDto[] => {
  if (!excludedCategoryIds.length) {
    return transactions.slice(0, limit);
  }

  const excludedCategoryIdSet = new Set(excludedCategoryIds);

  return transactions
    .filter((transaction) => {
      const categories = getTransactionCategories(transaction);

      return !categories.some((category) =>
        excludedCategoryIdSet.has(category.id),
      );
    })
    .slice(0, limit);
};
