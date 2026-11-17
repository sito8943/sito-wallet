import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import type { ProductDto, FilterProductDto } from "lib";
import {
  applyHideDeletedEntitiesPreference,
  defaultProductsListFilters,
  normalizeListFilters,
} from "lib";

import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";
import type { UseFetchPropsType } from "./types";
import { ProductsQueryKeys } from "./queryKeys/productsQueryKeys";

export function useInfiniteProductsList(
  props: UseFetchPropsType<ProductDto, FilterProductDto>,
) {
  const { filters = defaultProductsListFilters, query = {} } = props;

  const manager = useManager();
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const parsedFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeListFilters(filters),
        hideDeletedEntities,
      ) as FilterProductDto,
    [filters, hideDeletedEntities],
  );

  const parsedQueries = useMemo(
    () => ({
      sortingBy: query.sortingBy as keyof ProductDto,
      sortingOrder: query.sortingOrder,
      pageSize: query.pageSize ?? 20,
    }),
    [query.pageSize, query.sortingBy, query.sortingOrder],
  );

  return useInfiniteQuery({
    ...ProductsQueryKeys.infiniteList(parsedQueries, parsedFilters),
    enabled: !!account?.id,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      const currentPage = typeof pageParam === "number" ? pageParam : 0;
      const requestQuery = {
        ...parsedQueries,
        currentPage,
      };

      return manager.Products.get(requestQuery, parsedFilters);
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.currentPage + 1;
      if (nextPage >= lastPage.totalPages) return undefined;
      return nextPage;
    },
  });
}
