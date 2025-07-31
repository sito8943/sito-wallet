import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useAuth, useLocalCache, useManager } from "providers";

// types
import { UseFetchPropsType } from "./types.ts";

// lib
import {
  TransactionDto,
  CommonTransactionDto,
  FilterTransactionDto,
  QueryResult,
  Tables,
} from "lib";

export const TransactionsQueryKeys = {
  all: () => ({
    queryKey: ["transactions"],
  }),
  list: (id: number) => ({
    queryKey: [...TransactionsQueryKeys.all().queryKey, "list", id],
  }),
  common: () => ({
    queryKey: [...TransactionsQueryKeys.all().queryKey, "common"],
  }),
};

export function useTransactionsList(
  props: UseFetchPropsType<FilterTransactionDto>
): UseQueryResult<QueryResult<TransactionDto>> {
  const { filters = { deleted: false, accountId: 0 } } = props;

  const manager = useManager();
  const { account } = useAuth();
  const { loadCache, updateCache } = useLocalCache();

  return useQuery({
    ...TransactionsQueryKeys.list(filters.accountId ?? 0),
    queryFn: async () => {
      try {
        const result = await manager.Transactions.get({
          ...filters,
          userId: account?.id,
        });
        updateCache(Tables.Transactions, result.items);
        return result;
      } catch (error) {
        console.warn("API failed, loading transactions from cache", error);
        const cached = loadCache(Tables.Transactions);
        if (!cached || !Array.isArray(cached))
          throw new Error("No cached transactions available");
        return {
          items: cached as unknown as TransactionDto,
          total: cached?.length,
        } as unknown as QueryResult<TransactionDto>;
      }
    },
  });
}

export function useTransactionsCommon(): UseQueryResult<
  CommonTransactionDto[]
> {
  const manager = useManager();
  const { account } = useAuth();
  const { loadCache, updateCache } = useLocalCache();

  return useQuery({
    ...TransactionsQueryKeys.common(),
    queryFn: async () => {
      try {
        const result = await manager.Transactions.commonGet({
          deleted: false,
          userId: account?.id,
        });
        updateCache(Tables.Transactions, result);
        return result;
      } catch (error) {
        console.warn("API failed, loading transactions from cache", error);
        const cached = loadCache(Tables.Transactions) as CommonTransactionDto[];
        if (!cached || !Array.isArray(cached))
          throw new Error("No cached transactions available");
        return cached.map(({ id, name, updatedAt }) => ({
          id,
          name,
          updatedAt,
        }));
      }
    },
  });
}
