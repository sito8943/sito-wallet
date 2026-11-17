import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

// providers
import { useManager } from "providers";
import { useAuth } from "@sito/dashboard-app";

// types
import type { UseInfiniteAccountsListPropsType } from "./types.ts";

// lib
import type {
  AccountDto,
  FilterAccountDto,
  GetAccountsListOptionsDto,
} from "lib";
import {
  applyHideDeletedEntitiesPreference,
  defaultAccountsListFilters,
  normalizeListFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";

import { AccountsQueryKeys } from "./queryKeys/accountsQueryKeys";

export function useInfiniteAccountsList(
  props: UseInfiniteAccountsListPropsType,
) {
  const {
    filters = defaultAccountsListFilters,
    query = {},
    lastTransactionsLimit,
  } = props;

  const manager = useManager();
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

  // Latest transactions travel with the page itself: no request per account.
  const listOptions = useMemo<GetAccountsListOptionsDto>(
    () =>
      lastTransactionsLimit
        ? { includeLastTransactions: true, lastTransactionsLimit }
        : {},
    [lastTransactionsLimit],
  );

  return useInfiniteQuery({
    ...AccountsQueryKeys.infiniteList(
      parsedQueries,
      parsedFilters,
      listOptions,
    ),
    enabled: !!account?.id,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      const currentPage = typeof pageParam === "number" ? pageParam : 0;
      const requestQuery = {
        ...parsedQueries,
        currentPage,
      };

      return manager.Accounts.get(requestQuery, parsedFilters, listOptions);
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.currentPage + 1;
      if (nextPage >= lastPage.totalPages) return undefined;
      return nextPage;
    },
  });
}
