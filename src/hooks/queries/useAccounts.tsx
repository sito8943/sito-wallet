import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useLocalCache, useManager, useOfflineManager } from "providers";
import { QueryResult, useAuth } from "@sito/dashboard-app"

// types
import { UseFetchPropsType } from "./types.ts";

// lib
import {
  AccountDto,
  CommonAccountDto,
  FilterAccountDto,
  Tables,
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
  const { filters = { deletedAt: false as unknown as FilterAccountDto["deletedAt"] } } = props;

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();
  const { loadCache, updateCache } = useLocalCache();

  return useQuery({
    ...AccountsQueryKeys.list(filters),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.Accounts.get(undefined, {
          ...filters,
        });

        updateCache(Tables.Accounts, result.items);
        offlineManager.Accounts.seed(result.items).catch(() => {});
        return result;
      } catch (error) {
        console.warn("API failed, loading accounts from cache", error);
        const cached = loadCache(Tables.Accounts);
        if (!cached || !Array.isArray(cached))
          throw new Error("No cached accounts available");
        return {
          items: cached as unknown as AccountDto,
          total: cached?.length,
        } as unknown as QueryResult<AccountDto>;
      }
    },
  });
}

export function useAccountsCommon(): UseQueryResult<CommonAccountDto[]> {
  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();
  const { loadCache, updateCache, inCache } = useLocalCache();

  return useQuery({
    ...AccountsQueryKeys.common(),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.Accounts.commonGet({
          deletedAt: false as unknown as FilterAccountDto["deletedAt"],
        });
        if (!inCache(Tables.Accounts)) {
          updateCache(Tables.Accounts, result);
          offlineManager.Accounts.seed(result as unknown as AccountDto[]).catch(() => {});
        }
        return result;
      } catch (error) {
        console.warn("API failed, loading accounts from cache", error);
        const cached = loadCache(Tables.Accounts) as CommonAccountDto[];
        if (!cached || !Array.isArray(cached))
          throw new Error("No cached accounts available");
        return cached.map(({ id, name, updatedAt, currency }) => ({
          id,
          name,
          updatedAt,
          currency,
        }));
      }
    },
  });
}
