import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";
import { QueryParam, useAuth } from "@sito/dashboard-app";

// types
import { UseFetchPropsType } from "./types.ts";

// lib
import {
  TransactionCategoryDto,
  FilterTransactionCategoryDto,
  applyHideDeletedEntitiesPreference,
  defaultTransactionCategoriesListFilters,
  normalizeListFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useProfile";

import { TransactionCategoriesQueryKeys } from "./queryKeys/transactionCategoriesQueryKeys";

export function useInfiniteTransactionCategoriesList(
  props: UseFetchPropsType<
    TransactionCategoryDto,
    FilterTransactionCategoryDto
  >,
) {
  const {
    filters = defaultTransactionCategoriesListFilters,
    query = {} as Omit<QueryParam<TransactionCategoryDto>, "currentPage">,
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
      ) as FilterTransactionCategoryDto,
    [filters, hideDeletedEntities],
  );

  const parsedQueries = useMemo(
    () => ({
      sortingBy: query.sortingBy as keyof TransactionCategoryDto,
      sortingOrder: query.sortingOrder,
      pageSize: query.pageSize ?? 20,
    }),
    [query.pageSize, query.sortingBy, query.sortingOrder],
  );

  return useInfiniteQuery({
    ...TransactionCategoriesQueryKeys.infiniteList(
      parsedQueries,
      parsedFilters,
    ),
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
          parsedFilters,
        );
        offlineManager.TransactionCategories.seed(result.items).catch(() => {});
        return result;
      } catch (error) {
        console.warn("API failed, loading categories from IndexedDB", error);
        return await offlineManager.TransactionCategories.get(
          requestQuery,
          parsedFilters,
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
