// @sito/dashboard
import { SortOrder } from "@sito/dashboard";

// entities
import { BaseEntityDto } from "../entities";

export enum Tables {
  Accounts = "accounts",
  Currencies = "currencies",
  Transactions = "transactions",
  TransactionCategories = "transaction-categories",
}

export enum TablesCamelCase {
  Accounts = "accounts",
  Currencies = "currencies",
  Transactions = "transactions",
  TransactionCategories = "transactionCategories",
}

export enum EntityName {
  Account = "account",
  Currency = "currency",
  Transaction = "transaction",
  TransactionCategory = "transactionCategory",
}

export type APIError = {
  kind: string;
  message: string;
};

export type QueryResult<TDto> = {
  sort: keyof TDto;
  order: "asc" | "desc";
  currentPage: number;
  pageSize: number;
  total: number;
  items: TDto[];
};

export type QueryParam<TDto extends BaseEntityDto> = {
  sortingBy: keyof TDto;
  sortingOrder: SortOrder;
  currentPage: number;
  pageSize: number;
};
