import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";
import { QueryResult, useAuth } from "@sito/dashboard-app";

// types
import { UseFetchPropsType } from "./types.ts";

// lib
import {
  TransactionCategoryDto,
  CommonTransactionCategoryDto,
  FilterTransactionCategoryDto,
  defaultTransactionCategoriesListFilters,
  fetchTransactionCategoriesList,
} from "lib";

export const TransactionCategoriesQueryKeys = {
  all: () => ({
    queryKey: ["transaction-categories"],
  }),
  list: (filters: FilterTransactionCategoryDto) => ({
    queryKey: [
      ...TransactionCategoriesQueryKeys.all().queryKey,
      "list",
      filters,
    ],
  }),
  common: () => ({
    queryKey: [...TransactionCategoriesQueryKeys.all().queryKey, "common"],
  }),
};

export function useTransactionCategoriesList(
  props: UseFetchPropsType<TransactionCategoryDto, FilterTransactionCategoryDto>
): UseQueryResult<QueryResult<TransactionCategoryDto>> {
  const { filters = defaultTransactionCategoriesListFilters } = props;

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...TransactionCategoriesQueryKeys.list(filters),
    enabled: !!account?.id,
    queryFn: () =>
      fetchTransactionCategoriesList(manager, offlineManager, filters),
  });
}

export function useTransactionCategoriesCommon(): UseQueryResult<
  CommonTransactionCategoryDto[]
> {
  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...TransactionCategoriesQueryKeys.common(),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        return await manager.TransactionCategories.commonGet({
          deletedAt: false as unknown as FilterTransactionCategoryDto["deletedAt"],
        });
      } catch (error) {
        console.warn(
          "API failed, loading common categories from IndexedDB",
          error
        );
        return await offlineManager.TransactionCategories.commonGet({
          deletedAt: false as unknown as FilterTransactionCategoryDto["deletedAt"],
        });
      }
    },
  });
}
