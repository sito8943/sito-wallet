import { useMemo } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";
import { QueryResult, useAuth } from "@sito/dashboard-app";

// types
import { UseFetchPropsType } from "./types.ts";

// lib
import {
  CurrencyDto,
  FilterCurrencyDto,
  applyHideDeletedEntitiesPreference,
  defaultCurrenciesListFilters,
  fetchCurrenciesList,
  normalizeListFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useProfile";

import { CurrenciesQueryKeys } from "./queryKeys/currenciesQueryKeys";

export function useCurrenciesList(
  props: UseFetchPropsType<CurrencyDto, FilterCurrencyDto>,
): UseQueryResult<QueryResult<CurrencyDto>> {
  const { filters = defaultCurrenciesListFilters } = props;
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const normalizedFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeListFilters(filters) as Record<string, unknown>,
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
