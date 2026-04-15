import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import { SubscriptionRenewalDto } from "lib";

import { SubscriptionsQueryKeys } from "./queryKeys/subscriptionsQueryKeys";
import { UseSubscriptionsRenewalsProps } from "./types";

export function useSubscriptionsRenewals(
  props: UseSubscriptionsRenewalsProps = {},
): UseQueryResult<SubscriptionRenewalDto[]> {
  const { from, to } = props;

  const manager = useManager();
  const subscriptionsClient =
    "Subscriptions" in manager ? manager.Subscriptions : null;
  const { account } = useAuth();

  return useQuery({
    ...SubscriptionsQueryKeys.renewals(from, to),
    enabled: !!account?.id && !!subscriptionsClient,
    queryFn: () => {
      if (!subscriptionsClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      return subscriptionsClient.renewals({ from, to });
    },
  });
}
