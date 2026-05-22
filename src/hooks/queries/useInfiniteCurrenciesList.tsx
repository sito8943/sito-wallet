import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

// providers
import { useManager } from "providers";
import type { QueryParam } from "@sito/dashboard-app";
import { useAuth } from "@sito/dashboard-app";

// types
import type { UseFetchPropsType } from "./types.ts";

// lib
import type { CurrencyDto, FilterCurrencyDto } from "lib";
import {
  applyHideDeletedEntitiesPreference,
  defaultCurrenciesListFilters,
  normalizeListFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";

import { CurrenciesQueryKeys } from "./queryKeys/currenciesQueryKeys";

export function useInfiniteCurrenciesList(
  props: UseFetchPropsType<CurrencyDto, FilterCurrencyDto>,
) {
  const {
    filters = defaultCurrenciesListFilters,
    query = {} as Omit<QueryParam<CurrencyDto>, "currentPage">,
  } = props;

  const manager = useManager();
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const parsedFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeListFilters(filters),
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
    queryFn: ({ pageParam }) => {
      const currentPage = typeof pageParam === "number" ? pageParam : 0;
      const requestQuery = {
        ...parsedQueries,
        currentPage,
      };

      return manager.Currencies.get(requestQuery, parsedFilters);
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.currentPage + 1;
      if (nextPage >= lastPage.totalPages) return undefined;
      return nextPage;
    },
  });
}
