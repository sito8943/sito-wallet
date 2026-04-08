import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";
import { useAuth } from "@sito/dashboard-app";

// lib
import {
  CommonCurrencyDto,
  FilterCurrencyDto,
  applyHideDeletedEntitiesPreference,
  normalizeCommonFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useProfile";

import { CurrenciesQueryKeys } from "./queryKeys/currenciesQueryKeys";

export function useCurrenciesCommon(): UseQueryResult<CommonCurrencyDto[]> {
  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  return useQuery({
    ...CurrenciesQueryKeys.common(),
    enabled: !!account?.id,
    queryFn: async () => {
      const commonFilters = applyHideDeletedEntitiesPreference(
        normalizeCommonFilters() as Record<string, unknown>,
        hideDeletedEntities,
      ) as FilterCurrencyDto;

      try {
        return await manager.Currencies.commonGet(commonFilters);
      } catch (error) {
        console.warn(
          "API failed, loading common currencies from IndexedDB",
          error,
        );
        return await offlineManager.Currencies.commonGet(commonFilters);
      }
    },
  });
}
