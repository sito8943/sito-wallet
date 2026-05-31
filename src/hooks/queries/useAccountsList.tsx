import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// providers
import { useManager } from "providers";
import type { QueryParam, QueryResult } from "@sito/dashboard-app";
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

export function useAccountsList(
  props: UseFetchPropsType<AccountDto, FilterAccountDto>,
): UseQueryResult<QueryResult<AccountDto>> {
  const {
    filters = defaultAccountsListFilters,
    query = {} as QueryParam<AccountDto>,
  } = props;
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const normalizedFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeListFilters(filters),
        hideDeletedEntities,
      ) as FilterAccountDto,
    [filters, hideDeletedEntities],
  );

  const parsedQuery = useMemo(
    () => ({
      sortingBy: query.sortingBy as keyof AccountDto,
      sortingOrder: query.sortingOrder,
      pageSize: query.pageSize,
    }),
    [query.pageSize, query.sortingBy, query.sortingOrder],
  );

  const manager = useManager();
  const { account } = useAuth();

  return useQuery({
    ...AccountsQueryKeys.list(parsedQuery, normalizedFilters),
    enabled: !!account?.id,
    queryFn: () => manager.Accounts.get(parsedQuery, { ...normalizedFilters }),
  });
}
