import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useLocalCache, useManager } from "providers";

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
  list: () => ({ queryKey: [...AccountsQueryKeys.all().queryKey, "list"] }),
  common: () => ({
    queryKey: [...AccountsQueryKeys.all().queryKey, "common"],
  }),
};

export function useAccountsList(
  props: UseFetchPropsType<FilterAccountDto>
): UseQueryResult<QueryResult<AccountDto>> {
  const { filters = { deleted: false } } = props;

  const manager = useManager();
  const { loadCache, updateCache } = useLocalCache();

  return useQuery({
    ...AccountsQueryKeys.list(),
    queryFn: async () => {
      try {
        const result = await manager.Accounts.get(filters);
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
  const { loadCache, updateCache } = useLocalCache();

  return useQuery({
    ...AccountsQueryKeys.common(),
    queryFn: async () => {
      try {
        const result = await manager.Accounts.commonGet({ deleted: false });
        updateCache(Tables.Accounts, result);
        return result;
      } catch (error) {
        console.warn("API failed, loading accounts from cache", error);
        const cached = loadCache(Tables.Accounts) as CommonAccountDto[];
        if (!cached || !Array.isArray(cached))
          throw new Error("No cached accounts available");
        return cached.map(({ id, name, updatedAt }) => ({
          id,
          name,
          updatedAt,
        }));
      }
    },
  });
}
