import { useMemo } from "react";
import {
  useInfiniteQuery,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";
import { QueryParam, QueryResult, useAuth } from "@sito/dashboard-app";

// types
import { UseFetchPropsType } from "./types.ts";

// lib
import {
  CurrencyDto,
  CommonCurrencyDto,
  FilterCurrencyDto,
  defaultCurrenciesListFilters,
  fetchCurrenciesList,
  normalizeCommonFilters,
  normalizeListFilters,
} from "lib";

export const CurrenciesQueryKeys = {
  all: () => ({
    queryKey: ["currencies"],
  }),
  list: (filters: FilterCurrencyDto) => ({
    queryKey: [...CurrenciesQueryKeys.all().queryKey, "list", filters],
  }),
  infiniteList: (
    query: Omit<QueryParam<CurrencyDto>, "currentPage">,
    filters: FilterCurrencyDto
  ) => ({
    queryKey: [
      ...CurrenciesQueryKeys.all().queryKey,
      "infinite-list",
      query,
      filters,
    ],
  }),
  common: () => ({
    queryKey: [...CurrenciesQueryKeys.all().queryKey, "common"],
  }),
};

export function useCurrenciesList(
  props: UseFetchPropsType<CurrencyDto, FilterCurrencyDto>,
): UseQueryResult<QueryResult<CurrencyDto>> {
  const { filters = defaultCurrenciesListFilters } = props;
  const normalizedFilters = useMemo(
    () => normalizeListFilters(filters) as FilterCurrencyDto,
    [filters],
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

export function useInfiniteCurrenciesList(
  props: UseFetchPropsType<CurrencyDto, FilterCurrencyDto>
) {
  const {
    filters = defaultCurrenciesListFilters,
    query = {} as Omit<QueryParam<CurrencyDto>, "currentPage">,
  } = props;

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  const parsedFilters = useMemo(
    () => normalizeListFilters(filters) as FilterCurrencyDto,
    [filters]
  );

  const parsedQueries = useMemo(
    () => ({
      sortingBy: query.sortingBy as keyof CurrencyDto,
      sortingOrder: query.sortingOrder,
      pageSize: query.pageSize ?? 20,
    }),
    [query.pageSize, query.sortingBy, query.sortingOrder]
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
        const result = await manager.Currencies.get(requestQuery, parsedFilters);
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

export function useCurrenciesCommon(): UseQueryResult<CommonCurrencyDto[]> {
  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...CurrenciesQueryKeys.common(),
    enabled: !!account?.id,
    queryFn: async () => {
      const commonFilters = normalizeCommonFilters() as FilterCurrencyDto;

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
