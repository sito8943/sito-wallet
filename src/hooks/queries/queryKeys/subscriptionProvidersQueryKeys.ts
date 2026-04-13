import { FilterSubscriptionProviderDto } from "lib";

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
  common: (onlyEnabled: boolean) => ({
    queryKey: [
      ...SubscriptionProvidersQueryKeys.all().queryKey,
      "common",
      onlyEnabled,
    ],
  }),
};
