import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";
import { QueryResult, useAuth } from "@sito/dashboard-app";

// types
import { UseFetchPropsType } from "./types.ts";

// lib
import {
  CurrencyDto,
  CommonCurrencyDto,
  FilterCurrencyDto,
  defaultCurrenciesListFilters,
  fetchCurrenciesList,
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
  props: UseFetchPropsType<CurrencyDto, FilterCurrencyDto>,
): UseQueryResult<QueryResult<CurrencyDto>> {
  const { filters = defaultCurrenciesListFilters } = props;

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  console.log("currencies", account);

  return useQuery({
    ...CurrenciesQueryKeys.list(filters),
    enabled: !!account?.id,
    queryFn: () => fetchCurrenciesList(manager, offlineManager, filters),
  });
}

export function useCurrenciesCommon(): UseQueryResult<CommonCurrencyDto[]> {
  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...CurrenciesQueryKeys.common(),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        return await manager.Currencies.commonGet({
          deletedAt: false as unknown as FilterCurrencyDto["deletedAt"],
        });
      } catch (error) {
        console.warn(
          "API failed, loading common currencies from IndexedDB",
          error,
        );
        return await offlineManager.Currencies.commonGet({
          deletedAt: false as unknown as FilterCurrencyDto["deletedAt"],
        });
      }
    },
  });
}
