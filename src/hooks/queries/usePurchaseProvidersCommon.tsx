import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import type { CommonPurchaseProviderDto } from "lib";

import { PurchaseProvidersQueryKeys } from "./queryKeys/purchaseProvidersQueryKeys";
import { useCatalogSelect } from "./useCatalogSelect";
import type { UseCatalogCommonProps } from "./types";

export function usePurchaseProvidersCommon(
  props: UseCatalogCommonProps = {},
): UseQueryResult<CommonPurchaseProviderDto[]> {
  const { includeShared = false } = props;
  const select = useCatalogSelect<CommonPurchaseProviderDto>(includeShared);
  const manager = useManager();
  const { account } = useAuth();

  return useQuery({
    ...PurchaseProvidersQueryKeys.common(),
    enabled: !!account?.id,
    queryFn: () => manager.PurchaseProviders.commonGet({}),
    select,
  });
}
