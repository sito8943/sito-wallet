import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// types
import type { UseTransactionTypeResumePropsType } from "./types.ts";

// lib
import type {
  FilterTransactionTypeResumeDto,
  TransactionTypeResumeDto,
} from "lib";
import { TransactionType, TransactionTypeResumeTime } from "lib";

import { TransactionsQueryKeys } from "./queryKeys/transactionsQueryKeys";

export function useTransactionTypeResume(
  props: UseTransactionTypeResumePropsType,
): UseQueryResult<TransactionTypeResumeDto> {
  const filters = useMemo(
    () =>
      ({
        accountId: props.accountId ?? 0,
        time: props.time ?? TransactionTypeResumeTime.CurrentMonth,
        type: props.type ?? TransactionType.In,
        ...(props.excludedCategoryIds?.length
          ? {
              excludedCategoryIds: [...new Set(props.excludedCategoryIds)].sort(
                (left, right) => left - right,
              ),
            }
          : {}),
      }) as FilterTransactionTypeResumeDto,
    [props.accountId, props.excludedCategoryIds, props.time, props.type],
  );

  const manager = useManager();
  const { account } = useAuth();

  return useQuery({
    ...TransactionsQueryKeys.typeResume({
      ...filters,
    }),
    enabled: !!account?.id,
    queryFn: () => {
      return manager.Transactions.getTypeResume(filters);
    },
  });
}
