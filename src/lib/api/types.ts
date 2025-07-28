export enum Tables {
  Accounts = "accounts",
  Currencies = "currencies",
}

export enum TablesCamelCase {
  Accounts = "accounts",
  Currencies = "currencies",
}

export enum EntityName {
  Account = "account",
  Currency = "currency",
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
