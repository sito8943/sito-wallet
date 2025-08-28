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
  QueryParam,
} from "lib";
import { useTranslation } from "react-i18next";

export const TransactionsQueryKeys = {
  all: () => ({
    queryKey: ["transactions"],
  }),
  list: (query: QueryParam<TransactionDto>, filters: FilterTransactionDto) => ({
    queryKey: [...TransactionsQueryKeys.all().queryKey, "list", query, filters],
  }),
  common: (filters: FilterTransactionDto) => ({
    queryKey: [...TransactionsQueryKeys.all().queryKey, "common", filters],
  }),
  typeResume: (filters: FilterTransactionDto) => ({
    queryKey: [...TransactionsQueryKeys.all().queryKey, "typeResume", filters],
    enabled: !!filters.type,
  }),
};

export function useTransactionsList(
  props: UseFetchPropsType<TransactionDto, FilterTransactionDto>
): UseQueryResult<QueryResult<TransactionDto>> {
  const {
    sortingBy,
    sortingOrder,
    currentPage,
    pageSize,
    filters: tableFilters,
  } = useTableOptions();

  const { filters = { deleted: false }, query } = props;

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

  const parsedQueries = useMemo(
    () => ({
      sortingBy: sortingBy as keyof TransactionDto,
      sortingOrder,
      currentPage,
      pageSize,
      ...query,
    }),
    [currentPage, pageSize, query, sortingBy, sortingOrder]
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
          parsedFilters
        );

        updateCache(
          `${Tables.Transactions}_${filters?.accountId ?? 0}`,
          result.items
        );
        return result;
      } catch (error) {
        console.warn("API failed, loading transactions from cache", error);

        const cached = loadCache(
          `${Tables.Transactions}_${filters?.accountId ?? 0}`
        );
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
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.Transactions.getTypeResume({
          type: filters?.type ?? TransactionType.In,
          userId: account?.id ?? 0,
          account: filters?.account,
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

export function useTransactionsCommon(
  props: UseTransactionTypeResumePropsType
): UseQueryResult<CommonTransactionDto[]> {
  const manager = useManager();
  const { account } = useAuth();
  const filters = props;
  const { loadCache, updateCache, inCache } = useLocalCache();

  return useQuery({
    ...TransactionsQueryKeys.common(filters),
    queryFn: async () => {
      try {
        const result = await manager.Transactions.commonGet({
          deleted: false,
          userId: account?.id,
          ...filters,
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
