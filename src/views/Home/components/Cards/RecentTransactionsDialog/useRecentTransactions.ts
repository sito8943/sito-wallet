import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@sito/dashboard-app";

import { TransactionsQueryKeys } from "hooks";
import type { FilterTransactionDto, TransactionDto } from "lib";
import { normalizeListFilters } from "lib";
import { useManager } from "providers";

import type { UseRecentTransactionsPropsType } from "./types";
import {
  filterRecentTransactions,
  getRecentTransactionsQuery,
  normalizeRecentExcludedCategoryIds,
} from "./utils";

export const useRecentTransactions = (
  props: UseRecentTransactionsPropsType,
) => {
  const { open, filters, excludedCategoryIds, enabled = true } = props;
  const manager = useManager();
  const { account } = useAuth();

  const normalizedExcludedCategoryIds = useMemo(
    () => normalizeRecentExcludedCategoryIds(excludedCategoryIds),
    [excludedCategoryIds],
  );

  const query = useMemo(
    () => getRecentTransactionsQuery(normalizedExcludedCategoryIds),
    [normalizedExcludedCategoryIds],
  );

  const normalizedFilters = useMemo(
    () => normalizeListFilters(filters) as FilterTransactionDto,
    [filters],
  );

  const result = useQuery<TransactionDto[]>({
    queryKey: [
      ...TransactionsQueryKeys.all().queryKey,
      "recent",
      query,
      normalizedFilters,
      normalizedExcludedCategoryIds,
    ],
    enabled: open && enabled && !!account?.id,
    queryFn: async () => {
      const response = await manager.Transactions.get(query, normalizedFilters);

      return filterRecentTransactions(
        response.items ?? [],
        normalizedExcludedCategoryIds,
      );
    },
  });

  // `isLoading` is false while the query is still disabled, which happens on
  // every open until the auth account is hydrated (noticeably longer on
  // mobile). The dialog then rendered its empty state instead of a loader.
  // Anything pending while the dialog is meant to fetch counts as loading.
  return {
    ...result,
    isLoading: result.isPending && open && enabled,
  };
};
