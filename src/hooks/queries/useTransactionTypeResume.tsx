import { useMemo } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// providers
import { useManager, useOfflineManager } from "providers";

// types
import { UseTransactionTypeResumePropsType } from "./types.ts";

// lib
import {
  FilterTransactionTypeResumeDto,
  TransactionType,
  TransactionTypeResumeDto,
  applyHideDeletedEntitiesPreference,
  normalizeCommonFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useProfile";

import { TransactionsQueryKeys } from "./queryKeys/transactionsQueryKeys";

export function useTransactionTypeResume(
  props: UseTransactionTypeResumePropsType,
): UseQueryResult<TransactionTypeResumeDto> {
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const filters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeCommonFilters(props) as Record<string, unknown>,
        hideDeletedEntities,
      ) as FilterTransactionTypeResumeDto,
    [props, hideDeletedEntities],
  );
  const { t } = useTranslation();

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...TransactionsQueryKeys.typeResume({
      ...filters,
    }),
    enabled: !!account?.id,
    queryFn: async () => {
      const query = {
        ...filters,
        type: filters?.type ?? TransactionType.In,
      } as FilterTransactionTypeResumeDto;

      try {
        return await manager.Transactions.getTypeResume(query);
      } catch (error) {
        console.warn(
          "API failed, loading transaction type resume from IndexedDB",
          error,
        );

        try {
          return await offlineManager.Transactions.getTypeResume(query);
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
