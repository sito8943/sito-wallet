import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// types
import type { UseTransactionsGroupedByTypePropsType } from "./types.ts";

// lib
import type {
  FilterTransactionGroupedByTypeDto,
  TransactionTypeGroupedDto,
} from "lib";
import {
  applyHideDeletedEntitiesPreference,
  normalizeCommonFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";

import { TransactionsQueryKeys } from "./queryKeys/transactionsQueryKeys";

export function useTransactionsGroupedByType(
  props: UseTransactionsGroupedByTypePropsType,
): UseQueryResult<TransactionTypeGroupedDto> {
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const filters = useMemo<FilterTransactionGroupedByTypeDto>(() => {
    const normalized = applyHideDeletedEntitiesPreference(
      normalizeCommonFilters(props),
      hideDeletedEntities,
    ) as Partial<FilterTransactionGroupedByTypeDto>;

    return {
      ...normalized,
      accountId: props.accountId,
    };
  }, [props, hideDeletedEntities]);

  const manager = useManager();
  const { account } = useAuth();

  return useQuery({
    ...TransactionsQueryKeys.groupedByType(filters),
    enabled: !!account?.id && !!filters.accountId,
    queryFn: () => manager.Transactions.getGroupedByType(filters),
  });
}
