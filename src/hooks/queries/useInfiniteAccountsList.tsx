import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";
import type { QueryParam } from "@sito/dashboard-app";
import { useAuth } from "@sito/dashboard-app";

// types
import type { UseFetchPropsType } from "./types.ts";

// lib
import type { AccountDto, FilterAccountDto } from "lib";
import {
  applyHideDeletedEntitiesPreference,
  defaultAccountsListFilters,
  normalizeListFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";

import { AccountsQueryKeys } from "./queryKeys/accountsQueryKeys";

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
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const parsedFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeListFilters(filters),
        hideDeletedEntities,
      ) as FilterAccountDto,
    [filters, hideDeletedEntities],
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
