import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// @sito/dashboard-app
import type { QueryParam, QueryResult } from "@sito/dashboard-app";
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
    queryFn: () => manager.Transactions.get(parsedQueries, parsedFilters),
  });
}
