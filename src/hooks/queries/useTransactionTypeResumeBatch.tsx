import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import type {
  TransactionTypeResumeBatchDto,
  TransactionTypeResumeBatchRequestItemDto,
} from "lib";

import { TransactionsQueryKeys } from "./queryKeys/transactionsQueryKeys";

const normalizeIds = (ids?: number[]): number[] =>
  [...new Set(ids ?? [])].sort((left, right) => left - right);

const normalizeBatchItem = (
  item: TransactionTypeResumeBatchRequestItemDto,
): TransactionTypeResumeBatchRequestItemDto => {
  const excludedCategoryIds = normalizeIds(item.excludedCategoryIds);
  const oppositeExcludedCategoryIds = normalizeIds(
    item.oppositeExcludedCategoryIds,
  );

  return {
    cardId: item.cardId,
    ...(item.accountId ? { accountId: item.accountId } : {}),
    type: item.type,
    time: item.time,
    ...(excludedCategoryIds.length ? { excludedCategoryIds } : {}),
    ...(item.includeOpposite ? { includeOpposite: true } : {}),
    ...(item.includeOpposite && oppositeExcludedCategoryIds.length
      ? { oppositeExcludedCategoryIds }
      : {}),
  };
};

export function useTransactionTypeResumeBatch(
  items: TransactionTypeResumeBatchRequestItemDto[],
): UseQueryResult<TransactionTypeResumeBatchDto> {
  const manager = useManager();
  const { account } = useAuth();

  const normalizedItems = useMemo(
    () =>
      items
        .map(normalizeBatchItem)
        .sort((left, right) => left.cardId - right.cardId),
    [items],
  );

  return useQuery({
    ...TransactionsQueryKeys.typeResumeBatch(normalizedItems),
    enabled: !!account?.id && normalizedItems.length > 0,
    queryFn: () =>
      manager.Transactions.getTypeResumeBatch({ items: normalizedItems }),
  });
}
