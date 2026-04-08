import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

// @sito/dashboard-app
import { QueryParam, useAuth, useTableOptions } from "@sito/dashboard-app";

// providers
import { useManager, useOfflineManager } from "providers";

// lib
import {
  TransactionDto,
  FilterTransactionDto,
  applyHideDeletedEntitiesPreference,
  defaultTransactionsListFilters,
  normalizeListFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useProfile";

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
  const offlineManager = useOfflineManager();
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const parsedFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeListFilters({
          ...tableFilters,
          ...filters,
        }) as Record<string, unknown>,
        hideDeletedEntities,
      ) as FilterTransactionDto,
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
    queryFn: async ({ pageParam }) => {
      const currentPage = typeof pageParam === "number" ? pageParam : 0;
      const requestQuery = {
        ...parsedQueries,
        currentPage,
      };

      try {
        const result = await manager.Transactions.get(
          requestQuery,
          parsedFilters,
        );

        await offlineManager.Transactions.seed(result.items).catch(() => {});
        return result;
      } catch (error) {
        console.warn("API failed, loading transactions from IndexedDB", error);
        return await offlineManager.Transactions.get(
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
