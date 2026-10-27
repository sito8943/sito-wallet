import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import type { CommonPurchaseProviderDto } from "lib";

import { PurchaseProvidersQueryKeys } from "./queryKeys/purchaseProvidersQueryKeys";

export function usePurchaseProvidersCommon(): UseQueryResult<
  CommonPurchaseProviderDto[]
> {
  const manager = useManager();
  const { account } = useAuth();

  return useQuery({
    ...PurchaseProvidersQueryKeys.common(),
    enabled: !!account?.id,
    queryFn: () => manager.PurchaseProviders.commonGet({}),
  });
}
