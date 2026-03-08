import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";
import { QueryResult, useAuth } from "@sito/dashboard-app";

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
  common: () => ({
    queryKey: [...AccountsQueryKeys.all().queryKey, "common"],
  }),
};

export function useAccountsList(
  props: UseFetchPropsType<AccountDto, FilterAccountDto>
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
        console.warn("API failed, loading common accounts from IndexedDB", error);
        return await offlineManager.Accounts.commonGet({
          deletedAt: false as unknown as FilterAccountDto["deletedAt"],
        });
      }
    },
  });
}
