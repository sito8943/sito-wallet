export enum Tables {
  Accounts = "accounts",
}

export enum TablesCamelCase {
  Accounts = "accounts",
}

export enum EntityName {
  Account = "account",
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
