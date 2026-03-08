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

// types
import { UseTransactionTypeResumePropsType } from "./types.ts";

// lib
import {
  TransactionDto,
  CommonTransactionDto,
  FilterTransactionDto,
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
    filters = { deletedAt: false as unknown as Date },
    query = {} as QueryParam<TransactionDto>,
  } = props;

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

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

        offlineManager.Transactions.seed(result.items).catch(() => {});
        return result;
      } catch (error) {
        console.warn("API failed, loading transactions from IndexedDB", error);
        return await offlineManager.Transactions.get(
          parsedQueries,
          parsedFilters
        );
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
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...TransactionsQueryKeys.typeResume({
      ...filters,
    }),
    enabled: !!account?.id,
    queryFn: async () => {
      const query = {
        type: filters?.type ?? TransactionType.In,
        account: filters?.account,
        category: filters?.category,
        date: filters?.date,
      };

      try {
        return await manager.Transactions.getTypeResume(query);
      } catch (error) {
        console.warn(
          "API failed, loading transaction type resume from IndexedDB",
          error
        );

        try {
          return await offlineManager.Transactions.getTypeResume(query);
        } catch (offlineError) {
          throw new Error(
            `${t("_accessibility:errors.unknownError")} ${
              (offlineError as Error).message
            }`
          );
        }
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
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...TransactionsQueryKeys.weekly({
      ...filters,
    }),
    enabled: !!account?.id,
    queryFn: async () => {
      const query = {
        type: filters?.type ?? TransactionType.In,
        account: filters?.account,
      };

      try {
        return await manager.Transactions.weekly(query);
      } catch (error) {
        console.warn("API failed, loading weekly transactions from IndexedDB", error);

        try {
          return await offlineManager.Transactions.weekly(query);
        } catch (offlineError) {
          throw new Error(
            `${t("_accessibility:errors.unknownError")} ${
              (offlineError as Error).message
            }`
          );
        }
      }
    },
  });
}

export function useTransactionsCommon(
  //TODO FIX THIS
  props: UseTransactionTypeResumePropsType
): UseQueryResult<CommonTransactionDto[]> {
  const manager = useManager();
  const offlineManager = useOfflineManager();

  const filters = props;

  return useQuery({
    ...TransactionsQueryKeys.common(filters),
    queryFn: async () => {
      try {
        return await manager.Transactions.commonGet({
          deletedAt: false as unknown as Date,
          ...filters,
        });
      } catch (error) {
        console.warn(
          "API failed, loading common transactions from IndexedDB",
          error
        );
        return await offlineManager.Transactions.commonGet({
          deletedAt: false as unknown as Date,
          ...filters,
        });
      }
    },
  });
}
