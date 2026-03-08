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
  const { filters = { deletedAt: false as unknown as FilterTransactionCategoryDto["deletedAt"] } } = props;

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...TransactionCategoriesQueryKeys.list(filters),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.TransactionCategories.get(undefined, {
          ...filters,
        });

        offlineManager.TransactionCategories.seed(result.items).catch(() => {});
        return result;
      } catch (error) {
        console.warn("API failed, loading categories from IndexedDB", error);
        return await offlineManager.TransactionCategories.get(undefined, {
          ...filters,
        });
      }
    },
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
