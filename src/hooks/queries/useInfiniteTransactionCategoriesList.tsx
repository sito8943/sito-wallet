import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

// providers
import { useManager } from "providers";
import type { QueryParam } from "@sito/dashboard-app";
import { useAuth } from "@sito/dashboard-app";

// types
import type { UseFetchPropsType } from "./types.ts";

// lib
import type { TransactionCategoryDto, FilterTransactionCategoryDto } from "lib";
import {
  applyHideDeletedEntitiesPreference,
  defaultTransactionCategoriesListFilters,
  normalizeListFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";

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
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const parsedFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeListFilters(filters),
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
    queryFn: ({ pageParam }) => {
      const currentPage = typeof pageParam === "number" ? pageParam : 0;
      const requestQuery = {
        ...parsedQueries,
        currentPage,
      };

      return manager.TransactionCategories.get(requestQuery, parsedFilters);
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.currentPage + 1;
      if (nextPage >= lastPage.totalPages) return undefined;
      return nextPage;
    },
  });
}
