import { TFunction } from "i18next";

import { getFormattedDateTime } from "@sito/dashboard-app";

import {
  TransactionDto,
  TransactionType,
  getPrimaryTransactionCategory,
  getTransactionCategories,
} from "lib";

import { WeeklyTransactionsDateRangeType } from "../../utils";

export const getWeeklyTransactionsRangeLabel = (
  dateRange: WeeklyTransactionsDateRangeType,
): string => `${dateRange.start.slice(0, 10)} - ${dateRange.end.slice(0, 10)}`;

export const getWeeklyTransactionDateLabel = (
  value: TransactionDto["date"],
): string => getFormattedDateTime(String(value ?? ""));

export const getWeeklyTransactionDescriptionLabel = (
  transaction: TransactionDto,
  t: TFunction,
): string => {
  if (!transaction.description?.length) {
    return t("_entities:base.description.empty");
  }

  if (transaction.auto) {
    return `${t("_entities:transactionCategory.description.init")}: ${transaction.description}`;
  }

  return transaction.description;
};

export const getWeeklyTransactionCategoryLabel = (
  transaction: TransactionDto,
  t: TFunction,
): string => {
  const categories = getTransactionCategories(transaction);

  if (!categories.length) return "-";

  return categories
    .map((category) =>
      category.auto ? t("_entities:transactionCategory.name.init") : category.name,
    )
    .join(", ");
};

export const getWeeklyTransactionType = (
  transaction: TransactionDto,
): TransactionType =>
  getPrimaryTransactionCategory(transaction)?.type ?? TransactionType.In;

export const getWeeklyTransactionAmountPrefix = (
  transaction: TransactionDto,
): string =>
  getWeeklyTransactionType(transaction) === TransactionType.Out ? "- " : "";

export const getWeeklyTransactionAmountClassName = (
  transaction: TransactionDto,
): string =>
  getWeeklyTransactionType(transaction) === TransactionType.Out
    ? "text-bg-error"
    : "text-bg-success";
