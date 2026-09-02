import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// types
import type { UseTransactionCategoryAveragePropsType } from "./types.ts";

// lib
import type {
  FilterTransactionCategoryAverageDto,
  TransactionCategoryAverageDto,
} from "lib";
import { CategoryAverageGranularity, TransactionType } from "lib";

import { TransactionsQueryKeys } from "./queryKeys/transactionsQueryKeys";

export function useTransactionCategoryAverage(
  props: UseTransactionCategoryAveragePropsType,
): UseQueryResult<TransactionCategoryAverageDto> {
  const enabledProp = props.enabled ?? true;

  const filters = useMemo<FilterTransactionCategoryAverageDto>(
    () => ({
      from: props.from ?? "",
      to: props.to ?? "",
      granularity: props.granularity ?? CategoryAverageGranularity.Month,
      type: props.type ?? TransactionType.Out,
      ...(props.accountId ? { accountId: props.accountId } : {}),
      ...(props.categoryIds?.length
        ? {
            categoryIds: [...new Set(props.categoryIds)].sort(
              (left, right) => left - right,
            ),
          }
        : {}),
    }),
    [
      props.accountId,
      props.categoryIds,
      props.from,
      props.granularity,
      props.to,
      props.type,
    ],
  );

  const manager = useManager();
  const { account } = useAuth();

  const { enabled, ...queryKey } =
    TransactionsQueryKeys.categoryAverage(filters);

  return useQuery({
    ...queryKey,
    enabled: !!account?.id && enabled && enabledProp,
    queryFn: () => manager.Transactions.getCategoryAverage(filters),
  });
}
