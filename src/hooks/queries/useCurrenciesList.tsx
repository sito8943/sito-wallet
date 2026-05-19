import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";
import type { QueryResult } from "@sito/dashboard-app";
import { useAuth } from "@sito/dashboard-app";

// types
import type { UseFetchPropsType } from "./types.ts";

// lib
import type { CurrencyDto, FilterCurrencyDto } from "lib";
import {
  applyHideDeletedEntitiesPreference,
  defaultCurrenciesListFilters,
  fetchCurrenciesList,
  normalizeListFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";

import { CurrenciesQueryKeys } from "./queryKeys/currenciesQueryKeys";

export function useCurrenciesList(
  props: UseFetchPropsType<CurrencyDto, FilterCurrencyDto>,
): UseQueryResult<QueryResult<CurrencyDto>> {
  const { filters = defaultCurrenciesListFilters } = props;
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const normalizedFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeListFilters(filters),
        hideDeletedEntities,
      ) as FilterCurrencyDto,
    [filters, hideDeletedEntities],
  );

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...CurrenciesQueryKeys.list(normalizedFilters),
    enabled: !!account?.id,
    queryFn: () =>
      fetchCurrenciesList(manager, offlineManager, normalizedFilters),
  });
}
