// @sito/dashboard
import { SortOrder } from "@sito/dashboard";

export enum Tables {
  Accounts = "accounts",
  Currencies = "currencies",
  Transactions = "transactions",
  TransactionCategories = "transaction-categories",
  UserDashboardConfig = "user-dashboard-config",
}

export enum TablesCamelCase {
  Accounts = "accounts",
  Currencies = "currencies",
  Transactions = "transactions",
  TransactionCategories = "transactionCategories",
  UserDashboardConfig = "userDashboardConfig",
}

export enum EntityName {
  Account = "account",
  Currency = "currency",
  Transaction = "transaction",
  TransactionCategory = "transactionCategory",
  UserDashboardConfig = "userDashboardConfig",
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
  totalElements: number;
  totalPages: number;
  items: TDto[];
};

export type QueryParam<TDto> = {
  sortingBy?: keyof TDto;
  sortingOrder?: SortOrder;
  currentPage?: number;
  pageSize?: number;
};

export type RangeValue<T> = {
  start: T;
  end: T;
};
