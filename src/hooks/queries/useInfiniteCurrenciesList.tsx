import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";
import { QueryParam, useAuth } from "@sito/dashboard-app";

// types
import { UseFetchPropsType } from "./types.ts";

// lib
import {
  CurrencyDto,
  FilterCurrencyDto,
  applyHideDeletedEntitiesPreference,
  defaultCurrenciesListFilters,
  normalizeListFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useProfile";

import { CurrenciesQueryKeys } from "./queryKeys/currenciesQueryKeys";

export function useInfiniteCurrenciesList(
  props: UseFetchPropsType<CurrencyDto, FilterCurrencyDto>,
) {
  const {
    filters = defaultCurrenciesListFilters,
    query = {} as Omit<QueryParam<CurrencyDto>, "currentPage">,
  } = props;

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const parsedFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeListFilters(filters) as Record<string, unknown>,
        hideDeletedEntities,
      ) as FilterCurrencyDto,
    [filters, hideDeletedEntities],
  );

  const parsedQueries = useMemo(
    () => ({
      sortingBy: query.sortingBy as keyof CurrencyDto,
      sortingOrder: query.sortingOrder,
      pageSize: query.pageSize ?? 20,
    }),
    [query.pageSize, query.sortingBy, query.sortingOrder],
  );

  return useInfiniteQuery({
    ...CurrenciesQueryKeys.infiniteList(parsedQueries, parsedFilters),
    enabled: !!account?.id,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const currentPage = typeof pageParam === "number" ? pageParam : 0;
      const requestQuery = {
        ...parsedQueries,
        currentPage,
      };

      try {
        const result = await manager.Currencies.get(
          requestQuery,
          parsedFilters,
        );
        offlineManager.Currencies.seed(result.items).catch(() => {});
        return result;
      } catch (error) {
        console.warn("API failed, loading currencies from IndexedDB", error);
        return await offlineManager.Currencies.get(requestQuery, parsedFilters);
      }
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.currentPage + 1;
      if (nextPage >= lastPage.totalPages) return undefined;
      return nextPage;
    },
  });
}
