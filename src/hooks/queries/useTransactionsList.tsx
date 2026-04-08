import { useMemo } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

// @sito/dashboard-app
import {
  QueryParam,
  QueryResult,
  useAuth,
  useTableOptions,
} from "@sito/dashboard-app";

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

export function useTransactionsList(props: {
  filters: FilterTransactionDto;
  query?: QueryParam<TransactionDto>;
}): UseQueryResult<QueryResult<TransactionDto>> {
  const {
    sortingBy,
    sortingOrder,
    currentPage,
    pageSize,
    filters: tableFilters,
  } = useTableOptions();

  const {
    filters = defaultTransactionsListFilters,
    query = {} as QueryParam<TransactionDto>,
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
      sortingBy: sortingBy as keyof TransactionDto,
      sortingOrder,
      currentPage,
      pageSize,
      ...query,
    }),
    [currentPage, pageSize, query, sortingBy, sortingOrder],
  );

  return useQuery({
    ...TransactionsQueryKeys.list(parsedQueries, {
      ...parsedFilters,
    }),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.Transactions.get(
          parsedQueries,
          parsedFilters,
        );

        await offlineManager.Transactions.seed(result.items).catch(() => {});
        return result;
      } catch (error) {
        console.warn("API failed, loading transactions from IndexedDB", error);
        return await offlineManager.Transactions.get(
          parsedQueries,
          parsedFilters,
        );
      }
    },
  });
}
