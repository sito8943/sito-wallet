import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useLocalCache, useManager } from "providers";

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
  list: () => ({ queryKey: [...CurrenciesQueryKeys.all().queryKey, "list"] }),
  common: () => ({
    queryKey: [...CurrenciesQueryKeys.all().queryKey, "common"],
  }),
};

export function useCurrenciesList(
  props: UseFetchPropsType<FilterCurrencyDto>
): UseQueryResult<QueryResult<CurrencyDto>> {
  const { filters = { deleted: false } } = props;

  const manager = useManager();
  const { loadCache, updateCache } = useLocalCache();

  return useQuery({
    ...CurrenciesQueryKeys.list(),
    queryFn: async () => {
      try {
        const result = await manager.Currencies.get(filters);
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
  const { loadCache, updateCache } = useLocalCache();

  return useQuery({
    ...CurrenciesQueryKeys.common(),
    queryFn: async () => {
      try {
        const result = await manager.Currencies.commonGet({ deleted: false });
        updateCache(Tables.Currencies, result);
        return result;
      } catch (error) {
        console.warn("API failed, loading currencies from cache", error);
        const cached = loadCache(Tables.Currencies) as CommonCurrencyDto[];
        if (!cached || !Array.isArray(cached))
          throw new Error("No cached currencies available");
        return cached.map(({ id, name, updatedAt }) => ({
          id,
          name,
          updatedAt,
        }));
      }
    },
  });
}
