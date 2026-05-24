import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import type { SubscriptionRenewalForecastDto } from "lib";

import { SubscriptionsQueryKeys } from "./queryKeys/subscriptionsQueryKeys";
import type { UseSubscriptionsRenewalsForecastProps } from "./types";

export function useSubscriptionsRenewalsForecast(
  props: UseSubscriptionsRenewalsForecastProps = {},
): UseQueryResult<SubscriptionRenewalForecastDto> {
  const manager = useManager();
  const subscriptionsClient =
    "Subscriptions" in manager ? manager.Subscriptions : null;
  const { account } = useAuth();

  return useQuery({
    ...SubscriptionsQueryKeys.renewalsForecast(props),
    enabled: !!account?.id && !!subscriptionsClient,
    queryFn: () => {
      if (!subscriptionsClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      return subscriptionsClient.renewalsForecast(props);
    },
  });
}
