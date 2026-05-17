import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";
import type { QueryResult} from "@sito/dashboard-app";
import { useAuth } from "@sito/dashboard-app";

// types
import type { UseFetchPropsType } from "./types.ts";

// lib
import type {
  AccountDto,
  FilterAccountDto} from "lib";
import {
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
        normalizeListFilters(filters),
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
