import { useMemo } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import {
  CommonSubscriptionProviderDto,
  FilterSubscriptionProviderDto,
  defaultSubscriptionProvidersListFilters,
  normalizeCommonFilters,
} from "lib";

import { SubscriptionProvidersQueryKeys } from "./queryKeys/subscriptionProvidersQueryKeys";
import { UseSubscriptionProvidersCommonProps } from "./types";

export function useSubscriptionProvidersCommon(
  props: UseSubscriptionProvidersCommonProps = {},
): UseQueryResult<CommonSubscriptionProviderDto[]> {
  const { onlyEnabled = true } = props;

  const manager = useManager();
  const subscriptionProvidersClient =
    "SubscriptionProviders" in manager ? manager.SubscriptionProviders : null;
  const { account } = useAuth();

  const commonFilters = useMemo(
    () =>
      ({
        ...normalizeCommonFilters(
          defaultSubscriptionProvidersListFilters,
        ) as FilterSubscriptionProviderDto,
        ...(onlyEnabled ? { filters: "enabled==true" } : {}),
      }) as FilterSubscriptionProviderDto,
    [onlyEnabled],
  );

  return useQuery({
    ...SubscriptionProvidersQueryKeys.common(onlyEnabled),
    enabled: !!account?.id && !!subscriptionProvidersClient,
    queryFn: () => {
      if (!subscriptionProvidersClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      return subscriptionProvidersClient.commonGet(commonFilters);
    },
  });
}
