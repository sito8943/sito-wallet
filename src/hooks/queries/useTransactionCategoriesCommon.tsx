import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";
import { useAuth } from "@sito/dashboard-app";

// lib
import type {
  CommonTransactionCategoryDto,
  FilterTransactionCategoryDto,
} from "lib";
import {
  applyHideDeletedEntitiesPreference,
  normalizeCommonFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";

import { TransactionCategoriesQueryKeys } from "./queryKeys/transactionCategoriesQueryKeys";

export function useTransactionCategoriesCommon(): UseQueryResult<
  CommonTransactionCategoryDto[]
> {
  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  return useQuery({
    ...TransactionCategoriesQueryKeys.common(),
    enabled: !!account?.id,
    queryFn: async () => {
      const commonFilters = applyHideDeletedEntitiesPreference(
        normalizeCommonFilters(),
        hideDeletedEntities,
      ) as FilterTransactionCategoryDto;

      try {
        return await manager.TransactionCategories.commonGet(commonFilters);
      } catch (error) {
        console.warn(
          "API failed, loading common categories from IndexedDB",
          error,
        );
        return await offlineManager.TransactionCategories.commonGet(
          commonFilters,
        );
      }
    },
  });
}
