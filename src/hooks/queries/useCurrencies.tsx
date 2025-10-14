import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useLocalCache } from "providers";
import { useManager } from "providers";
import { useAuth } from "@sito/dashboard-app"

// types
import { UseFetchPropsType } from "./types.ts";

// lib
import {
  CurrencyDto,
  CommonCurrencyDto,
  FilterCurrencyDto,
  QueryResult,
  Tables,
} from "lib";

export const CurrenciesQueryKeys = {
  all: () => ({
    queryKey: ["currencies"],
  }),
  list: (filters: FilterCurrencyDto) => ({
    queryKey: [...CurrenciesQueryKeys.all().queryKey, "list", filters],
  }),
  common: () => ({
    queryKey: [...CurrenciesQueryKeys.all().queryKey, "common"],
  }),
};

export function useCurrenciesList(
  props: UseFetchPropsType<CurrencyDto, FilterCurrencyDto>
): UseQueryResult<QueryResult<CurrencyDto>> {
  const { filters = { deleted: false } } = props;

  const manager = useManager();
  const { account } = useAuth();
  const { loadCache, updateCache } = useLocalCache();

  return useQuery({
    ...CurrenciesQueryKeys.list(filters),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.Currencies.get(undefined, {
          ...filters,
          userId: account?.id,
        });
        updateCache(Tables.Currencies, result.items);
        return result;
      } catch (error) {
        console.warn("API failed, loading currencies from cache", error);
        const cached = loadCache(Tables.Currencies);
        if (!cached || !Array.isArray(cached))
          throw new Error("No cached currencies available");
        return {
          items: cached as unknown as CurrencyDto,
          total: cached?.length,
        } as unknown as QueryResult<CurrencyDto>;
      }
    },
  });
}

export function useCurrenciesCommon(): UseQueryResult<CommonCurrencyDto[]> {
  const manager = useManager();
  const { account } = useAuth();
  const { loadCache, updateCache, inCache } = useLocalCache();

  return useQuery({
    ...CurrenciesQueryKeys.common(),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.Currencies.commonGet({
          deleted: false,
          userId: account?.id,
        });
        if (!inCache(Tables.Currencies)) updateCache(Tables.Currencies, result);
        return result;
      } catch (error) {
        console.warn("API failed, loading currencies from cache", error);
        const cached = loadCache(Tables.Currencies) as CommonCurrencyDto[];
        if (!cached || !Array.isArray(cached))
          throw new Error("No cached currencies available");
        return cached.map(
          ({ id, name, updatedAt, symbol }: CommonCurrencyDto) => ({
            id,
            name,
            symbol,
            updatedAt,
          })
        );
      }
    },
  });
}
