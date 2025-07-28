import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useLocalCache, useManager } from "providers";

// types
import { UseFetchPropsType } from "./types.ts";

// lib
import {
  WalletDto,
  CommonWalletDto,
  FilterWalletDto,
  QueryResult,
  Tables,
} from "lib";

export const WalletsQueryKeys = {
  all: () => ({
    queryKey: ["wallets"],
  }),
  list: () => ({ queryKey: [...WalletsQueryKeys.all().queryKey, "list"] }),
  common: () => ({
    queryKey: [...WalletsQueryKeys.all().queryKey, "common"],
  }),
};

export function useWalletsList(
  props: UseFetchPropsType<FilterWalletDto>
): UseQueryResult<QueryResult<WalletDto>> {
  const { filters = { deleted: false } } = props;

  const manager = useManager();
  const { loadCache, updateCache } = useLocalCache();

  return useQuery({
    ...WalletsQueryKeys.list(),
    queryFn: async () => {
      try {
        const result = await manager.Wallets.get(filters);
        updateCache(Tables.Wallets, result.items);
        return result;
      } catch (error) {
        console.warn("API failed, loading wallets from cache", error);
        const cached = loadCache(Tables.Wallets);
        if (!cached || !Array.isArray(cached))
          throw new Error("No cached wallets available");
        return { items: cached, total: cached?.length };
      }
    },
  });
}

export function useWalletsCommon(): UseQueryResult<CommonWalletDto[]> {
  const manager = useManager();
  const { loadCache, updateCache } = useLocalCache();

  return useQuery({
    ...WalletsQueryKeys.common(),
    queryFn: async () => {
      try {
        const result = await manager.Wallets.commonGet({ deleted: false });
        updateCache(Tables.Wallets, result.items);
        return result;
      } catch (error) {
        console.warn("API failed, loading wallets from cache", error);
        const cached = (await loadCache(Tables.Wallets)) as CommonWalletDto[];
        if (!cached || !Array.isArray(cached))
          throw new Error("No cached wallets available");
        return cached.map(({ id, name }) => ({ id, name }));
      }
    },
  });
}
