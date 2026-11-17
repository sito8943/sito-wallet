import type { TFunction } from "i18next";

import type { ColumnType } from "@sito/dashboard-app";

import type { TransactionTableRowType } from "../../types";

import { Money } from "components";
import { TransactionCardAvatar } from "../TransactionCardAvatar";

import {
  getWeeklyTransactionAmountClassName,
  getWeeklyTransactionCategoryLabel,
  getWeeklyTransactionDateLabel,
  getWeeklyTransactionDescriptionLabel,
  getWeeklyTransactionType,
} from "./utils";

import "./styles.css";

export const getWeeklyTransactionsTableColumns = (
  t: TFunction,
): ColumnType<TransactionTableRowType>[] => [
  {
    key: "date",
    label: t("_entities:transaction.date.label"),
    sortable: true,
    renderBody: (_value: unknown, transaction: TransactionTableRowType) =>
      getWeeklyTransactionDateLabel(transaction.date),
  },
  {
    key: "type",
    label: t("_entities:transactionCategory.type.label"),
    sortable: true,
    renderBody: (_value: unknown, transaction: TransactionTableRowType) => (
      <div className="weekly-transactions-type-cell">
        <TransactionCardAvatar
          type={getWeeklyTransactionType(transaction)}
          purchaseProvider={transaction.purchaseProvider}
          compact
        />
      </div>
    ),
  },
  {
    key: "description",
    label: t("_entities:base.description.label"),
    sortable: true,
    renderBody: (_value: unknown, transaction: TransactionTableRowType) =>
      getWeeklyTransactionDescriptionLabel(transaction, t),
  },
  {
    key: "category",
    label: t("_entities:transaction.category.label"),
    sortable: true,
    renderBody: (_value: unknown, transaction: TransactionTableRowType) =>
      getWeeklyTransactionCategoryLabel(transaction, t),
  },
  {
    key: "amount",
    label: t("_entities:transaction.amount.label"),
    sortable: true,
    renderBody: (_value: unknown, transaction: TransactionTableRowType) => (
      <p className={getWeeklyTransactionAmountClassName(transaction)}>
        <Money
          amount={transaction.amount}
          currency={transaction.account?.currency}
        />
      </p>
    ),
  },
];
