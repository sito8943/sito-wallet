import type { QueryParam } from "@sito/dashboard-app";

import {
  TransactionType,
  getPrimaryTransactionCategory,
  getTransactionCategories,
} from "lib";
import type { TransactionDto } from "lib";

import {
  RECENT_TRANSACTIONS_LIMIT,
  RECENT_TRANSACTIONS_PREFILTER_QUERY,
  RECENT_TRANSACTIONS_QUERY,
} from "./constants";

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

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
): QueryParam<TransactionDto> =>
  excludedCategoryIds.length
    ? RECENT_TRANSACTIONS_PREFILTER_QUERY
    : RECENT_TRANSACTIONS_QUERY;

export const filterRecentTransactions = (
  transactions: TransactionDto[],
  excludedCategoryIds: number[],
): TransactionDto[] => {
  if (!excludedCategoryIds.length) {
    return transactions.slice(0, RECENT_TRANSACTIONS_LIMIT);
  }

  const excludedCategoryIdSet = new Set(excludedCategoryIds);

  return transactions
    .filter((transaction) => {
      const categories = getTransactionCategories(transaction);

      return !categories.some((category) =>
        excludedCategoryIdSet.has(category.id),
      );
    })
    .slice(0, RECENT_TRANSACTIONS_LIMIT);
};

export const isRecentTransactionIncome = (
  transaction: TransactionDto,
): boolean =>
  (getPrimaryTransactionCategory(transaction)?.type ?? TransactionType.In) ===
  TransactionType.In;

export const getRecentTransactionAmountPrefix = (
  transaction: TransactionDto,
): string => (isRecentTransactionIncome(transaction) ? "+ " : "- ");
