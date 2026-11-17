import type { QueryParam } from "@sito/dashboard-app";

import type { FilterPurchaseProviderDto, PurchaseProviderDto } from "lib";

export const PurchaseProvidersQueryKeys = {
  all: () => ({
    queryKey: ["purchase-providers"],
  }),
  common: () => ({
    queryKey: [...PurchaseProvidersQueryKeys.all().queryKey, "common"],
  }),
  infiniteList: (
    query: Omit<QueryParam<PurchaseProviderDto>, "currentPage">,
    filters: FilterPurchaseProviderDto,
  ) => ({
    queryKey: [
      ...PurchaseProvidersQueryKeys.all().queryKey,
      "infinite-list",
      query,
      filters,
    ],
  }),
};
