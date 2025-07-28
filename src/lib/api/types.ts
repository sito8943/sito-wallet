export enum Tables {
  Accounts = "walletAccounts",
}

export enum TablesCamelCase {
  Accounts = "walletAccounts",
}

export enum EntityName {
  Account = "walletAccount",
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
