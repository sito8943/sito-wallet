import { useMemo } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// providers
import { useManager, useOfflineManager } from "providers";

// lib
import {
  FilterWeeklyTransactionDto,
  TransactionType,
  TransactionWeeklySpentDto,
  applyHideDeletedEntitiesPreference,
  normalizeCommonFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useProfile";

import { TransactionsQueryKeys } from "./queryKeys/transactionsQueryKeys";

export function useWeekly(
  props: FilterWeeklyTransactionDto,
): UseQueryResult<TransactionWeeklySpentDto> {
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const filters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeCommonFilters(props) as Record<string, unknown>,
        hideDeletedEntities,
      ) as FilterWeeklyTransactionDto,
    [props, hideDeletedEntities],
  );
  const { t } = useTranslation();

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();
  return useQuery({
    ...TransactionsQueryKeys.weekly({
      ...filters,
    }),
    enabled: !!account?.id,
    queryFn: async () => {
      const query = {
        type: filters?.type ?? TransactionType.In,
        account: filters?.account,
        ...(filters?.deletedAt !== undefined
          ? { deletedAt: filters.deletedAt }
          : {}),
      } as FilterWeeklyTransactionDto;

      try {
        return await manager.Transactions.weekly(query);
      } catch (error) {
        console.warn(
          "API failed, loading weekly transactions from IndexedDB",
          error,
        );

        try {
          return await offlineManager.Transactions.weekly(query);
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
