import { useMemo } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";
import { QueryResult, useAuth } from "@sito/dashboard-app";

// types
import { UseFetchPropsType } from "./types.ts";

// lib
import {
  AccountDto,
  FilterAccountDto,
  applyHideDeletedEntitiesPreference,
  defaultAccountsListFilters,
  fetchAccountsList,
  normalizeListFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useProfile";

import { AccountsQueryKeys } from "./queryKeys/accountsQueryKeys";

export function useAccountsList(
  props: UseFetchPropsType<AccountDto, FilterAccountDto>,
): UseQueryResult<QueryResult<AccountDto>> {
  const { filters = defaultAccountsListFilters } = props;
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const normalizedFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeListFilters(filters) as Record<string, unknown>,
        hideDeletedEntities,
      ) as FilterAccountDto,
    [filters, hideDeletedEntities],
  );

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...AccountsQueryKeys.list(normalizedFilters),
    enabled: !!account?.id,
    queryFn: () =>
      fetchAccountsList(manager, offlineManager, normalizedFilters),
  });
}
