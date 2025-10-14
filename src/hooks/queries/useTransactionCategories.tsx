import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useLocalCache, useManager } from "providers";
import { useAuth } from "@sito/dashboard-app"

// types
import { UseFetchPropsType } from "./types.ts";

// lib
import {
  TransactionCategoryDto,
  CommonTransactionCategoryDto,
  FilterTransactionCategoryDto,
  QueryResult,
  Tables,
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
  const { filters = { deleted: false } } = props;

  const manager = useManager();
  const { account } = useAuth();
  const { loadCache, updateCache, inCache } = useLocalCache();

  return useQuery({
    ...TransactionCategoriesQueryKeys.list(filters),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.TransactionCategories.get(undefined, {
          ...filters,
          userId: account?.id,
        });
        if (!inCache(Tables.TransactionCategories))
          updateCache(Tables.TransactionCategories, result.items);
        return result;
      } catch (error) {
        console.warn("API failed, loading accounts from cache", error);
        const cached = loadCache(Tables.TransactionCategories);
        if (!cached || !Array.isArray(cached))
          throw new Error("No cached accounts available");
        return {
          items: cached as unknown as TransactionCategoryDto,
          total: cached?.length,
        } as unknown as QueryResult<TransactionCategoryDto>;
      }
    },
  });
}

export function useTransactionCategoriesCommon(): UseQueryResult<
  CommonTransactionCategoryDto[]
> {
  const manager = useManager();
  const { account } = useAuth();
  const { loadCache, updateCache } = useLocalCache();

  return useQuery({
    ...TransactionCategoriesQueryKeys.common(),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.TransactionCategories.commonGet({
          deleted: false,
          userId: account?.id,
        });
        updateCache(Tables.TransactionCategories, result);
        return result;
      } catch (error) {
        console.warn("API failed, loading accounts from cache", error);
        const cached = loadCache(
          Tables.TransactionCategories
        ) as CommonTransactionCategoryDto[];
        if (!cached || !Array.isArray(cached))
          throw new Error("No cached accounts available");
        return cached.map(
          ({
            id,
            name,
            type,
            updatedAt,
            initial,
          }: CommonTransactionCategoryDto) => ({
            id,
            name,
            type,
            updatedAt,
            initial,
          })
        );
      }
    },
  });
}
