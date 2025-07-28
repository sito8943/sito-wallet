export enum Tables {
  Wallets = "wallets",
}

export enum TablesCamelCase {
  Wallets = "wallets",
}

export enum EntityName {
  Wallet = "wallet",
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
