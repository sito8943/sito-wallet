import type { FilterSubscriptionDto, FilterSubscriptionProviderDto } from "lib";

export const defaultSubscriptionsListFilters: FilterSubscriptionDto = {
  softDeleteScope: "ACTIVE",
};

export const defaultSubscriptionProvidersListFilters: FilterSubscriptionProviderDto =
  {
    softDeleteScope: "ACTIVE",
  };
