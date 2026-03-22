import { useMemo } from "react";
import {
  useInfiniteQuery,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";
import { QueryParam, QueryResult, useAuth } from "@sito/dashboard-app";

// types
import { UseFetchPropsType } from "./types.ts";

// lib
import {
  AccountDto,
  CommonAccountDto,
  FilterAccountDto,
  defaultAccountsListFilters,
  fetchAccountsList,
} from "lib";

export const AccountsQueryKeys = {
  all: () => ({
    queryKey: ["accounts"],
  }),
  list: (filters: FilterAccountDto) => ({
    queryKey: [...AccountsQueryKeys.all().queryKey, "list", filters],
  }),
  infiniteList: (
    query: Omit<QueryParam<AccountDto>, "currentPage">,
    filters: FilterAccountDto,
  ) => ({
    queryKey: [
      ...AccountsQueryKeys.all().queryKey,
      "infinite-list",
      query,
      filters,
    ],
  }),
  common: () => ({
    queryKey: [...AccountsQueryKeys.all().queryKey, "common"],
  }),
};

export function useAccountsList(
  props: UseFetchPropsType<AccountDto, FilterAccountDto>,
): UseQueryResult<QueryResult<AccountDto>> {
  const { filters = defaultAccountsListFilters } = props;

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...AccountsQueryKeys.list(filters),
    enabled: !!account?.id,
    queryFn: () => fetchAccountsList(manager, offlineManager, filters),
  });
}

export function useInfiniteAccountsList(
  props: UseFetchPropsType<AccountDto, FilterAccountDto>,
) {
  const {
    filters = defaultAccountsListFilters,
    query = {} as Omit<QueryParam<AccountDto>, "currentPage">,
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
      sortingBy: query.sortingBy as keyof AccountDto,
      sortingOrder: query.sortingOrder,
      pageSize: query.pageSize ?? 20,
    }),
    [query.pageSize, query.sortingBy, query.sortingOrder],
  );

  return useInfiniteQuery({
    ...AccountsQueryKeys.infiniteList(parsedQueries, parsedFilters),
    enabled: !!account?.id,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const currentPage = typeof pageParam === "number" ? pageParam : 0;
      const requestQuery = {
        ...parsedQueries,
        currentPage,
      };

      try {
        const result = await manager.Accounts.get(requestQuery, parsedFilters);
        offlineManager.Accounts.seed(result.items).catch(() => {});
        return result;
      } catch (error) {
        console.warn("API failed, loading accounts from IndexedDB", error);
        return await offlineManager.Accounts.get(requestQuery, parsedFilters);
      }
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.currentPage + 1;
      if (nextPage >= lastPage.totalPages) return undefined;
      return nextPage;
    },
  });
}

export function useAccountsCommon(): UseQueryResult<CommonAccountDto[]> {
  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...AccountsQueryKeys.common(),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        return await manager.Accounts.commonGet({
          deletedAt: false as unknown as FilterAccountDto["deletedAt"],
        });
      } catch (error) {
        console.warn(
          "API failed, loading common accounts from IndexedDB",
          error,
        );
        return await offlineManager.Accounts.commonGet({
          deletedAt: false as unknown as FilterAccountDto["deletedAt"],
        });
      }
    },
  });
}
