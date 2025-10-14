import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useLocalCache } from "providers";
import { useManager } from "providers";
import { useAuth } from "@sito/dashboard-app"

// types
import { UseFetchPropsType } from "./types.ts";

// lib
import {
  AccountDto,
  CommonAccountDto,
  FilterAccountDto,
  QueryResult,
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
  const { filters = { deleted: false } } = props;

  const manager = useManager();
  const { account } = useAuth();
  const { loadCache, updateCache } = useLocalCache();

  return useQuery({
    ...AccountsQueryKeys.list(filters),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.Accounts.get(undefined, {
          ...filters,
          userId: account?.id,
        });

        updateCache(Tables.Accounts, result.items);
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
  const { account } = useAuth();
  const { loadCache, updateCache, inCache } = useLocalCache();

  return useQuery({
    ...AccountsQueryKeys.common(),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.Accounts.commonGet({
          deleted: false,
          userId: account?.id,
        });
        if (!inCache(Tables.Accounts)) updateCache(Tables.Accounts, result);
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
