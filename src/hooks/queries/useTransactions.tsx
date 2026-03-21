import { useMemo } from "react";
import {
  useInfiniteQuery,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";

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
import {
  UseTransactionTypeResumePropsType,
  UseTransactionsGroupedByTypePropsType,
} from "./types.ts";

// lib
import {
  TransactionDto,
  CommonTransactionDto,
  FilterTransactionDto,
  TransactionTypeResumeDto,
  TransactionType,
  FilterTransactionTypeResumeDto,
  FilterTransactionGroupedByTypeDto,
  FilterWeeklyTransactionDto,
  TransactionWeeklySpentDto,
  TransactionTypeGroupedDto,
} from "lib";
import { useTranslation } from "react-i18next";

export const TransactionsQueryKeys = {
  all: () => ({
    queryKey: ["transactions"],
  }),
  list: (query: QueryParam<TransactionDto>, filters: FilterTransactionDto) => ({
    queryKey: [...TransactionsQueryKeys.all().queryKey, "list", query, filters],
  }),
  infiniteList: (
    query: Omit<QueryParam<TransactionDto>, "currentPage">,
    filters: FilterTransactionDto,
  ) => ({
    queryKey: [
      ...TransactionsQueryKeys.all().queryKey,
      "infinite-list",
      query,
      filters,
    ],
  }),
  common: (filters: FilterTransactionDto) => ({
    queryKey: [...TransactionsQueryKeys.all().queryKey, "common", filters],
  }),
  typeResume: (filters: FilterTransactionDto) => ({
    queryKey: [...TransactionsQueryKeys.all().queryKey, "typeResume", filters],
    enabled: !!filters.type,
  }),
  weekly: (filters: FilterWeeklyTransactionDto) => ({
    queryKey: [...TransactionsQueryKeys.all().queryKey, "weekly", filters],
    enabled: Array.isArray(filters.account) && filters.account.length > 0,
  }),
  groupedByType: (filters: FilterTransactionGroupedByTypeDto) => ({
    queryKey: [
      ...TransactionsQueryKeys.all().queryKey,
      "groupedByType",
      filters,
    ],
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
    [filters, tableFilters],
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

export function useInfiniteTransactionsList(props: {
  filters: FilterTransactionDto;
  query?: Omit<QueryParam<TransactionDto>, "currentPage">;
}) {
  const {
    filters = { deletedAt: false as unknown as Date },
    query = {} as Omit<QueryParam<TransactionDto>, "currentPage">,
  } = props;

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  const parsedFilters = useMemo(
    () => ({
      ...filters,
    }),
    [filters],
  );

  const parsedQueries = useMemo(
    () => ({
      sortingBy: query.sortingBy as keyof TransactionDto,
      sortingOrder: query.sortingOrder,
      pageSize: query.pageSize ?? 20,
    }),
    [query.pageSize, query.sortingBy, query.sortingOrder],
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

export function useTransactionTypeResume(
  props: UseTransactionTypeResumePropsType,
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
          error,
        );

        try {
          return await offlineManager.Transactions.getTypeResume(query);
        } catch (offlineError) {
          throw new Error(
            `${t("_accessibility:errors.unknownError")} ${
              (offlineError as Error).message
            }`,
          );
        }
      }
    },
  });
}

export function useWeekly(
  props: FilterTransactionTypeResumeDto,
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
        console.warn(
          "API failed, loading weekly transactions from IndexedDB",
          error,
        );

        try {
          return await offlineManager.Transactions.weekly(query);
        } catch (offlineError) {
          throw new Error(
            `${t("_accessibility:errors.unknownError")} ${
              (offlineError as Error).message
            }`,
          );
        }
      }
    },
  });
}

export function useTransactionsGroupedByType(
  props: UseTransactionsGroupedByTypePropsType,
): UseQueryResult<TransactionTypeGroupedDto> {
  const filters = props;
  const { t } = useTranslation();

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...TransactionsQueryKeys.groupedByType(filters),
    enabled: !!account?.id && !!filters.accountId,
    queryFn: async () => {
      try {
        return await manager.Transactions.getGroupedByType(filters);
      } catch (error) {
        console.warn(
          "API failed, loading grouped transactions by type from IndexedDB",
          error,
        );

        try {
          return await offlineManager.Transactions.getGroupedByType(filters);
        } catch (offlineError) {
          throw new Error(
            `${t("_accessibility:errors.unknownError")} ${
              (offlineError as Error).message
            }`,
          );
        }
      }
    },
  });
}

export function useTransactionsCommon(
  //TODO FIX THIS
  props: UseTransactionTypeResumePropsType,
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
          error,
        );
        return await offlineManager.Transactions.commonGet({
          deletedAt: false as unknown as Date,
          ...filters,
        });
      }
    },
  });
}
