import type { QueryParam } from "@sito/dashboard-app";

import type { FilterProductDto, ProductDto } from "lib";

export const ProductsQueryKeys = {
  all: () => ({
    queryKey: ["products"],
  }),
  common: () => ({
    queryKey: [...ProductsQueryKeys.all().queryKey, "common"],
  }),
  infiniteList: (
    query: Omit<QueryParam<ProductDto>, "currentPage">,
    filters: FilterProductDto,
  ) => ({
    queryKey: [
      ...ProductsQueryKeys.all().queryKey,
      "infinite-list",
      query,
      filters,
    ],
  }),
};
