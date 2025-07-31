import { useQuery, UseQueryResult } from "@tanstack/react-query";

// @sito/dashboard
import { useTableOptions } from "@sito/dashboard";

// providers
import { useAuth, useLocalCache, useManager } from "providers";

// types
import { UseFetchPropsType } from "./types.ts";

// lib
import {
  TransactionDto,
  CommonTransactionDto,
  FilterTransactionDto,
  QueryResult,
  Tables,
} from "lib";
import { useMemo } from "react";

export const TransactionsQueryKeys = {
  all: () => ({
    queryKey: ["transactions"],
  }),
  list: (filters: FilterTransactionDto) => ({
    queryKey: [...TransactionsQueryKeys.all().queryKey, "list", filters],
  }),
  common: () => ({
    queryKey: [...TransactionsQueryKeys.all().queryKey, "common"],
  }),
};

export function useTransactionsList(
  props: UseFetchPropsType<FilterTransactionDto>
): UseQueryResult<QueryResult<TransactionDto>> {
  const {
    sortingBy,
    sortingOrder,
    currentPage,
    pageSize,
    filters: tableFilters,
  } = useTableOptions();

  const { filters = { deleted: false, accountId: 0 } } = props;

  const manager = useManager();
  const { account } = useAuth();
  const { loadCache, updateCache } = useLocalCache();

  const parsedFilters = useMemo(
    () => ({
      sortingBy,
      sortingOrder,
      currentPage,
      pageSize,
      ...tableFilters,
      ...filters,
      userId: account?.id,
    }),
    [
      account?.id,
      currentPage,
      filters,
      pageSize,
      sortingBy,
      sortingOrder,
      tableFilters,
    ]
  );

  return useQuery({
    ...TransactionsQueryKeys.list(parsedFilters),
    queryFn: async () => {
      try {
        const result = await manager.Transactions.get(parsedFilters);
        updateCache(Tables.Transactions, result.items);
        return result;
      } catch (error) {
        console.warn("API failed, loading transactions from cache", error);
        const cached = loadCache(Tables.Transactions);
        if (!cached || !Array.isArray(cached))
          throw new Error("No cached transactions available");
        return {
          items: cached as unknown as TransactionDto,
          total: cached?.length,
        } as unknown as QueryResult<TransactionDto>;
      }
    },
  });
}

export function useTransactionsCommon(): UseQueryResult<
  CommonTransactionDto[]
> {
  const manager = useManager();
  const { account } = useAuth();
  const { loadCache, updateCache } = useLocalCache();

  return useQuery({
    ...TransactionsQueryKeys.common(),
    queryFn: async () => {
      try {
        const result = await manager.Transactions.commonGet({
          deleted: false,
          userId: account?.id,
        });
        updateCache(Tables.Transactions, result);
        return result;
      } catch (error) {
        console.warn("API failed, loading transactions from cache", error);
        const cached = loadCache(Tables.Transactions) as CommonTransactionDto[];
        if (!cached || !Array.isArray(cached))
          throw new Error("No cached transactions available");
        return cached.map(({ id, name, updatedAt }) => ({
          id,
          name,
          updatedAt,
        }));
      }
    },
  });
}
