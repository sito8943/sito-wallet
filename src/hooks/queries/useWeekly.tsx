import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// lib
import type {
  FilterWeeklyTransactionDto,
  TransactionWeeklySpentDto,
} from "lib";
import {
  TransactionType,
  applyHideDeletedEntitiesPreference,
  normalizeCommonFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";

import { TransactionsQueryKeys } from "./queryKeys/transactionsQueryKeys";

export function useWeekly(
  props: FilterWeeklyTransactionDto,
): UseQueryResult<TransactionWeeklySpentDto> {
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const filters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeCommonFilters(props),
        hideDeletedEntities,
      ) as FilterWeeklyTransactionDto,
    [props, hideDeletedEntities],
  );

  const manager = useManager();
  const { account } = useAuth();
  return useQuery({
    ...TransactionsQueryKeys.weekly({
      ...filters,
    }),
    enabled: !!account?.id,
    queryFn: () => {
      const query = {
        type: filters?.type ?? TransactionType.In,
        account: filters?.account,
        ...(filters?.deletedAt !== undefined
          ? { deletedAt: filters.deletedAt }
          : {}),
      } as FilterWeeklyTransactionDto;

      return manager.Transactions.weekly(query);
    },
  });
}
