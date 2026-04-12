import { SortOrder } from "@sito/dashboard-app";
import type { TFunction } from "i18next";

import { TransactionType } from "lib";
import type { TransactionDto } from "lib";

import {
  getWeeklyTransactionCategoryLabel,
  getWeeklyTransactionDescriptionLabel,
  getWeeklyTransactionType,
} from "./utils";

const compareStrings = (left: string, right: string): number =>
  left.localeCompare(right, undefined, {
    sensitivity: "base",
    numeric: true,
  });

const compareNumbers = (left: number, right: number): number => left - right;

const getSortableAmount = (transaction: TransactionDto): number => {
  const amount = Number(transaction.amount) || 0;
  return getWeeklyTransactionType(transaction) === TransactionType.Out
    ? -amount
    : amount;
};

const getSortableDate = (transaction: TransactionDto): number => {
  const parsed = Date.parse(String(transaction.date ?? ""));
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getSortableText = (value: string): string => value.toLocaleLowerCase();

const getSortableValue = (
  transaction: TransactionDto,
  property: string,
  t: TFunction,
): number | string => {
  switch (property) {
    case "amount":
      return getSortableAmount(transaction);
    case "date":
      return getSortableDate(transaction);
    case "type":
      return getSortableText(getWeeklyTransactionType(transaction));
    case "category":
      return getSortableText(getWeeklyTransactionCategoryLabel(transaction, t));
    case "description":
      return getSortableText(
        getWeeklyTransactionDescriptionLabel(transaction, t),
      );
    default:
      return getSortableDate(transaction);
  }
};

export const sortWeeklyTransactions = (
  items: TransactionDto[],
  property: string,
  order: SortOrder,
  t: TFunction,
): TransactionDto[] => {
  const direction = order === SortOrder.ASC ? 1 : -1;

  return [...items].sort((leftTransaction, rightTransaction) => {
    const left = getSortableValue(leftTransaction, property, t);
    const right = getSortableValue(rightTransaction, property, t);

    const result =
      typeof left === "number" && typeof right === "number"
        ? compareNumbers(left, right)
        : compareStrings(String(left), String(right));

    if (result !== 0) return result * direction;

    return compareNumbers(leftTransaction.id, rightTransaction.id);
  });
};
