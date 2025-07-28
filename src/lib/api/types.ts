export enum Tables {
  Products = "products",
  Categories = "categories",
  Movements = "movements",
  MovementLogs = "movement-logs",
}

export enum TablesCamelCase {
  Products = "products",
  Categories = "categories",
  Movements = "movements",
  MovementLogs = "movementLogs",
}

export enum EntityName {
  Product = "product",
  Category = "category",
  Movement = "movement",
  MovementLog = "movementLog",
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
