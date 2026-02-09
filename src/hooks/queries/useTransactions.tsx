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
import { useLocalCache, useManager } from "providers";

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
  Tables,
  TransactionTypeResumeDto,
  TransactionType,
  FilterTransactionTypeResumeDto,
  TransactionWeeklySpentDto,
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
  weekly: (filters: FilterTransactionDto) => ({
    queryKey: [...TransactionsQueryKeys.all().queryKey, "weekly", filters],
    enabled: !!filters.accountId,
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

  const { filters = { deletedAt: false as unknown as any }, query } = props;

  const manager = useManager();
  const { account } = useAuth();
  const { loadCache, updateCache } = useLocalCache();

  const parsedFilters = useMemo(
    () => ({
      ...tableFilters,
      ...filters,
    }),
    [filters, tableFilters]
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
      ...filters,
    }),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.Transactions.getTypeResume({
          type: filters?.type ?? TransactionType.In,
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

export function useWeekly(
  props: FilterTransactionTypeResumeDto
): UseQueryResult<TransactionWeeklySpentDto> {
  const filters = props;
  const { t } = useTranslation();

  const manager = useManager();
  const { account } = useAuth();

  return useQuery({
    ...TransactionsQueryKeys.weekly({
      ...filters,
    }),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.Transactions.weekly({
          type: filters?.type ?? TransactionType.In,
          account: filters?.account,
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
          deletedAt: false as unknown as any,
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
