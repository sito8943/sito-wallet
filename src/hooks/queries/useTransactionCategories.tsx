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
  TransactionCategoryDto,
  CommonTransactionCategoryDto,
  FilterTransactionCategoryDto,
  defaultTransactionCategoriesListFilters,
  fetchTransactionCategoriesList,
} from "lib";

export const TransactionCategoriesQueryKeys = {
  all: () => ({
    queryKey: ["transaction-categories"],
  }),
  list: (filters: FilterTransactionCategoryDto) => ({
    queryKey: [
      ...TransactionCategoriesQueryKeys.all().queryKey,
      "list",
      filters,
    ],
  }),
  infiniteList: (
    query: Omit<QueryParam<TransactionCategoryDto>, "currentPage">,
    filters: FilterTransactionCategoryDto
  ) => ({
    queryKey: [
      ...TransactionCategoriesQueryKeys.all().queryKey,
      "infinite-list",
      query,
      filters,
    ],
  }),
  common: () => ({
    queryKey: [...TransactionCategoriesQueryKeys.all().queryKey, "common"],
  }),
};

export function useTransactionCategoriesList(
  props: UseFetchPropsType<TransactionCategoryDto, FilterTransactionCategoryDto>
): UseQueryResult<QueryResult<TransactionCategoryDto>> {
  const { filters = defaultTransactionCategoriesListFilters } = props;

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...TransactionCategoriesQueryKeys.list(filters),
    enabled: !!account?.id,
    queryFn: () =>
      fetchTransactionCategoriesList(manager, offlineManager, filters),
  });
}

export function useInfiniteTransactionCategoriesList(
  props: UseFetchPropsType<TransactionCategoryDto, FilterTransactionCategoryDto>
) {
  const {
    filters = defaultTransactionCategoriesListFilters,
    query = {} as Omit<QueryParam<TransactionCategoryDto>, "currentPage">,
  } = props;

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  const parsedFilters = useMemo(
    () => ({
      ...filters,
    }),
    [filters]
  );

  const parsedQueries = useMemo(
    () => ({
      sortingBy: query.sortingBy as keyof TransactionCategoryDto,
      sortingOrder: query.sortingOrder,
      pageSize: query.pageSize ?? 20,
    }),
    [query.pageSize, query.sortingBy, query.sortingOrder]
  );

  return useInfiniteQuery({
    ...TransactionCategoriesQueryKeys.infiniteList(parsedQueries, parsedFilters),
    enabled: !!account?.id,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const currentPage = typeof pageParam === "number" ? pageParam : 0;
      const requestQuery = {
        ...parsedQueries,
        currentPage,
      };

      try {
        const result = await manager.TransactionCategories.get(
          requestQuery,
          parsedFilters
        );
        offlineManager.TransactionCategories.seed(result.items).catch(() => {});
        return result;
      } catch (error) {
        console.warn("API failed, loading categories from IndexedDB", error);
        return await offlineManager.TransactionCategories.get(
          requestQuery,
          parsedFilters
        );
      }
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.currentPage + 1;
      if (nextPage >= lastPage.totalPages) return undefined;
      return nextPage;
    },
  });
}

export function useTransactionCategoriesCommon(): UseQueryResult<
  CommonTransactionCategoryDto[]
> {
  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...TransactionCategoriesQueryKeys.common(),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        return await manager.TransactionCategories.commonGet({
          deletedAt: false as unknown as FilterTransactionCategoryDto["deletedAt"],
        });
      } catch (error) {
        console.warn(
          "API failed, loading common categories from IndexedDB",
          error
        );
        return await offlineManager.TransactionCategories.commonGet({
          deletedAt: false as unknown as FilterTransactionCategoryDto["deletedAt"],
        });
      }
    },
  });
}
