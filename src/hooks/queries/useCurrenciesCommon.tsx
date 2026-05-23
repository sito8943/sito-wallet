import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// providers
import { useManager } from "providers";
import { useAuth } from "@sito/dashboard-app";

// lib
import type { CommonCurrencyDto, FilterCurrencyDto } from "lib";
import {
  applyHideDeletedEntitiesPreference,
  normalizeCommonFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";

import { CurrenciesQueryKeys } from "./queryKeys/currenciesQueryKeys";

export function useCurrenciesCommon(): UseQueryResult<CommonCurrencyDto[]> {
  const manager = useManager();
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  return useQuery({
    ...CurrenciesQueryKeys.common(),
    enabled: !!account?.id,
    queryFn: () => {
      const commonFilters = applyHideDeletedEntitiesPreference(
        normalizeCommonFilters(),
        hideDeletedEntities,
      ) as FilterCurrencyDto;

      return manager.Currencies.commonGet(commonFilters);
    },
  });
}
