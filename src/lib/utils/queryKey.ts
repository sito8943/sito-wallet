import { InvalidateQueryFilters, QueryKey } from "@tanstack/react-query";

export interface EntityInvalidateQueryFilters
  extends Omit<InvalidateQueryFilters, "queryKey"> {
  queryKey: QueryKey;
}

export interface EntityQueryKey<T> {
  [key: string]: (param?: T) => EntityInvalidateQueryFilters;
}
