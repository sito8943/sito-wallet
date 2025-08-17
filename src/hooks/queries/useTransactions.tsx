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
  typeResume: () => ({
    queryKey: [...TransactionsQueryKeys.all().queryKey, "typeResume"],
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

  const { filters = { deleted: false } } = props;

  const manager = useManager();
  const { account } = useAuth();
  const { loadCache, updateCache } = useLocalCache();

  const parsedFilters = useMemo(
    () => ({
      ...tableFilters,
      ...filters,
      userId: account?.id,
    }),
    [account?.id, filters, tableFilters]
  );

  return useQuery({
    ...TransactionsQueryKeys.list({
      sortingBy: sortingBy as keyof TransactionDto,
      sortingOrder,
      currentPage,
      pageSize,
      ...parsedFilters,
    }),
    queryFn: async () => {
      try {
        const result = await manager.Transactions.get(
          {
            sortingBy: sortingBy as keyof TransactionDto,
            sortingOrder,
            currentPage,
            pageSize,
          },
          parsedFilters
        );

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

export function useTransactionTypeResume(
  props: UseFetchPropsType<FilterTransactionDto>
): UseQueryResult<QueryResult<TransactionDto>> {
  const { filters = { deleted: false, date: undefined } } = props;

  const manager = useManager();
  const { account } = useAuth();
  const { loadCache, updateCache } = useLocalCache();

  return useQuery({
    ...TransactionsQueryKeys.list({ accountId: account?.id, ...filters }),
    queryFn: async () => {
      try {
        const result = await manager.Transactions.get(undefined, {
          accountId: account?.id,
          ...filters,
        });

        updateCache(Tables.TransactionsTypeResume, result.items);
        return result;
      } catch (error) {
        console.warn("API failed, loading transactions from cache", error);
        const cached = loadCache(Tables.TransactionsTypeResume);
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
  const { loadCache, updateCache, inCache } = useLocalCache();

  return useQuery({
    ...TransactionsQueryKeys.common(),
    queryFn: async () => {
      try {
        const result = await manager.Transactions.commonGet({
          deleted: false,
          userId: account?.id,
        });
        if (!inCache(Tables.Transactions))
          updateCache(Tables.Transactions, result);
        return result;
      } catch (error) {
        console.warn("API failed, loading transactions from cache", error);
        const cached = loadCache(Tables.Transactions) as CommonTransactionDto[];
        if (!cached || !Array.isArray(cached))
          throw new Error("No cached transactions available");
        return cached.map(({ id, updatedAt }) => ({
          id,
          updatedAt,
        }));
      }
    },
  });
}
