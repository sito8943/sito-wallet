import { useMemo } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

// @sito/dashboard
import { useTableOptions } from "@sito/dashboard";

// providers
import { useAuth, useLocalCache, useManager } from "providers";

// types
import {
  UseFetchPropsType,
  UseTransactionTypeResumePropsType,
} from "./types.ts";

// lib
import {
  TransactionDto,
  CommonTransactionDto,
  FilterTransactionDto,
  QueryResult,
  Tables,
  TransactionTypeResumeDto,
  TransactionType,
} from "lib";
import { useTranslation } from "react-i18next";

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
  typeResume: (filters: FilterTransactionDto) => ({
    queryKey: [...TransactionsQueryKeys.all().queryKey, "typeResume", filters],
    enabled: !!filters.type,
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

  console.log(parsedFilters);

  return useQuery({
    ...TransactionsQueryKeys.list({
      sortingBy: sortingBy as keyof TransactionDto,
      sortingOrder,
      currentPage,
      pageSize,
      ...parsedFilters,
    }),
    enabled: !!account?.id,
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
  props: UseTransactionTypeResumePropsType
): UseQueryResult<TransactionTypeResumeDto> {
  const filters = props;
  const { t } = useTranslation();

  const manager = useManager();
  const { account } = useAuth();

  return useQuery({
    ...TransactionsQueryKeys.typeResume({
      userId: account?.id,
      ...filters,
    }),
    enabled: !!filters?.accountId && !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.Transactions.getTypeResume({
          type: filters?.type ?? TransactionType.In,
          userId: account?.id ?? 0,
          accountId: filters?.accountId,
          category: filters?.category,
          date: filters?.date,
        });

        return result;
      } catch (error) {
        throw new Error(
          `${t("_accessibility:errors.unknownError")} ${
            (error as Error).message
          }`
        );
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
