import { QueryParam } from "@sito/dashboard-app";

import { FilterSubscriptionProviderDto, SubscriptionProviderDto } from "lib";

export const SubscriptionProvidersQueryKeys = {
  all: () => ({
    queryKey: ["subscription-providers"],
  }),
  list: (filters: FilterSubscriptionProviderDto) => ({
    queryKey: [
      ...SubscriptionProvidersQueryKeys.all().queryKey,
      "list",
      filters,
    ],
  }),
  infiniteList: (
    query: Omit<QueryParam<SubscriptionProviderDto>, "currentPage">,
    filters: FilterSubscriptionProviderDto,
  ) => ({
    queryKey: [
      ...SubscriptionProvidersQueryKeys.all().queryKey,
      "infinite-list",
      query,
      filters,
    ],
  }),
  common: (onlyEnabled: boolean) => ({
    queryKey: [
      ...SubscriptionProvidersQueryKeys.all().queryKey,
      "common",
      onlyEnabled,
    ],
  }),
};
