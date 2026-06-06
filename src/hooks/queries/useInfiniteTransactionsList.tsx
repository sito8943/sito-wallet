import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

// @sito/dashboard-app
import type { QueryParam } from "@sito/dashboard-app";
import { useAuth, useTableOptions } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// lib
import type { TransactionDto, FilterTransactionDto } from "lib";
import {
  applyHideDeletedEntitiesPreference,
  defaultTransactionsListFilters,
  normalizeListFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";

import { TransactionsQueryKeys } from "./queryKeys/transactionsQueryKeys";

export function useInfiniteTransactionsList(props: {
  filters: FilterTransactionDto;
  query?: Omit<QueryParam<TransactionDto>, "currentPage">;
}) {
  const { sortingBy, sortingOrder, filters: tableFilters } = useTableOptions();

  const {
    filters = defaultTransactionsListFilters,
    query = {} as Omit<QueryParam<TransactionDto>, "currentPage">,
  } = props;

  const manager = useManager();
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const parsedFilters = useMemo(
    () => {
      const normalizedFilters = normalizeListFilters({
        ...tableFilters,
        ...filters,
      }) as FilterTransactionDto;

      if (tableFilters.auto === undefined) {
        normalizedFilters.auto = false;
      }

      return applyHideDeletedEntitiesPreference(
        normalizedFilters,
        hideDeletedEntities,
      ) as FilterTransactionDto;
    },
    [filters, tableFilters, hideDeletedEntities],
  );

  const parsedQueries = useMemo(
    () => ({
      sortingBy: (sortingBy as keyof TransactionDto) || query.sortingBy,
      sortingOrder: sortingOrder || query.sortingOrder,
      pageSize: query.pageSize ?? 20,
    }),
    [
      query.pageSize,
      query.sortingBy,
      query.sortingOrder,
      sortingBy,
      sortingOrder,
    ],
  );

  return useInfiniteQuery({
    ...TransactionsQueryKeys.infiniteList(parsedQueries, parsedFilters),
    enabled: !!account?.id,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      const currentPage = typeof pageParam === "number" ? pageParam : 0;
      const requestQuery = {
        ...parsedQueries,
        currentPage,
      };

      return manager.Transactions.get(requestQuery, parsedFilters);
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.currentPage + 1;
      if (nextPage >= lastPage.totalPages) return undefined;
      return nextPage;
    },
  });
}
