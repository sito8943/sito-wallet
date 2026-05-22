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
import {
  TransactionType,
  applyHideDeletedEntitiesPreference,
  normalizeCommonFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";

import { TransactionsQueryKeys } from "./queryKeys/transactionsQueryKeys";

export function useTransactionTypeResume(
  props: UseTransactionTypeResumePropsType,
): UseQueryResult<TransactionTypeResumeDto> {
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const filters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeCommonFilters(props),
        hideDeletedEntities,
      ) as FilterTransactionTypeResumeDto,
    [props, hideDeletedEntities],
  );

  const manager = useManager();
  const { account } = useAuth();

  return useQuery({
    ...TransactionsQueryKeys.typeResume({
      ...filters,
    }),
    enabled: !!account?.id,
    queryFn: () => {
      const query = {
        ...filters,
        type: filters?.type ?? TransactionType.In,
      } as FilterTransactionTypeResumeDto;

      return manager.Transactions.getTypeResume(query);
    },
  });
}
