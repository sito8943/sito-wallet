import { useMemo } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// providers
import { useManager, useOfflineManager } from "providers";

// types
import { UseTransactionsGroupedByTypePropsType } from "./types.ts";

// lib
import {
  FilterTransactionGroupedByTypeDto,
  TransactionTypeGroupedDto,
  applyHideDeletedEntitiesPreference,
  normalizeCommonFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useProfile";

import { TransactionsQueryKeys } from "./queryKeys/transactionsQueryKeys";

export function useTransactionsGroupedByType(
  props: UseTransactionsGroupedByTypePropsType,
): UseQueryResult<TransactionTypeGroupedDto> {
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const filters = useMemo<FilterTransactionGroupedByTypeDto>(() => {
    const normalized = applyHideDeletedEntitiesPreference(
      normalizeCommonFilters(props) as Record<string, unknown>,
      hideDeletedEntities,
    ) as Partial<FilterTransactionGroupedByTypeDto>;

    return {
      ...normalized,
      accountId: props.accountId,
    };
  }, [props, hideDeletedEntities]);
  const { t } = useTranslation();

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...TransactionsQueryKeys.groupedByType(filters),
    enabled: !!account?.id && !!filters.accountId,
    queryFn: async () => {
      try {
        return await manager.Transactions.getGroupedByType(filters);
      } catch (error) {
        console.warn(
          "API failed, loading grouped transactions by type from IndexedDB",
          error,
        );

        try {
          return await offlineManager.Transactions.getGroupedByType(filters);
        } catch (offlineError) {
          throw new Error(
            `${t("_accessibility:errors.unknownError")} ${
              (offlineError as Error).message
            }`,
          );
        }
      }
    },
  });
}
