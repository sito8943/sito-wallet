import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// providers
import { useManager, useOnboardingDraft } from "providers";
import { useAuth } from "@sito/dashboard-app";

// lib
import type { CommonCurrencyDto, FilterCurrencyDto } from "lib";
import {
  applyHideDeletedEntitiesPreference,
  draftCurrencyToCommon,
  normalizeCommonFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";

import { CurrenciesQueryKeys } from "./queryKeys/currenciesQueryKeys";

export function useCurrenciesCommon(): UseQueryResult<CommonCurrencyDto[]> {
  const manager = useManager();
  const { account } = useAuth();
  const { draft, isAnonymous } = useOnboardingDraft();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const draftCurrencies = useMemo(
    () => draft.currencies.map(draftCurrencyToCommon),
    [draft.currencies],
  );

  const query = useQuery({
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

  if (isAnonymous) {
    return {
      ...query,
      data: draftCurrencies,
      isLoading: false,
      isPending: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      status: "success",
      error: null,
    } as UseQueryResult<CommonCurrencyDto[]>;
  }

  return query;
}
