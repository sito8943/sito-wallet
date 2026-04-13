import { QueryParam } from "@sito/dashboard-app";

import { FilterSubscriptionDto, SubscriptionDto } from "lib";

export const SubscriptionsQueryKeys = {
  all: () => ({
    queryKey: ["subscriptions"],
  }),
  list: (filters: FilterSubscriptionDto) => ({
    queryKey: [...SubscriptionsQueryKeys.all().queryKey, "list", filters],
  }),
  infiniteList: (
    query: Omit<QueryParam<SubscriptionDto>, "currentPage">,
    filters: FilterSubscriptionDto,
  ) => ({
    queryKey: [
      ...SubscriptionsQueryKeys.all().queryKey,
      "infinite-list",
      query,
      filters,
    ],
  }),
  common: () => ({
    queryKey: [...SubscriptionsQueryKeys.all().queryKey, "common"],
  }),
  renewals: (from?: string, to?: string) => ({
    queryKey: [...SubscriptionsQueryKeys.all().queryKey, "renewals", from, to],
  }),
};
