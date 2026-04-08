import { useMemo } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";

// types
import { UseTransactionTypeResumePropsType } from "./types.ts";

// lib
import {
  CommonTransactionDto,
  FilterTransactionDto,
  applyHideDeletedEntitiesPreference,
  normalizeCommonFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useProfile";

import { TransactionsQueryKeys } from "./queryKeys/transactionsQueryKeys";

export function useTransactionsCommon(
  //TODO FIX THIS
  props: UseTransactionTypeResumePropsType,
): UseQueryResult<CommonTransactionDto[]> {
  const manager = useManager();
  const offlineManager = useOfflineManager();

  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const filters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeCommonFilters(props) as Record<string, unknown>,
        hideDeletedEntities,
      ) as FilterTransactionDto,
    [props, hideDeletedEntities],
  );

  return useQuery({
    ...TransactionsQueryKeys.common(filters),
    queryFn: async () => {
      try {
        return await manager.Transactions.commonGet(filters);
      } catch (error) {
        console.warn(
          "API failed, loading common transactions from IndexedDB",
          error,
        );
        return await offlineManager.Transactions.commonGet(filters);
      }
    },
  });
}
