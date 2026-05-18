import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";
import { useAuth } from "@sito/dashboard-app";

// lib
import type {
  CommonAccountDto,
  FilterAccountDto} from "lib";
import {
  applyHideDeletedEntitiesPreference,
  normalizeCommonFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";

import { AccountsQueryKeys } from "./queryKeys/accountsQueryKeys";

export function useAccountsCommon(): UseQueryResult<CommonAccountDto[]> {
  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  return useQuery({
    ...AccountsQueryKeys.common(),
    enabled: !!account?.id,
    queryFn: async () => {
      const commonFilters = applyHideDeletedEntitiesPreference(
        normalizeCommonFilters(),
        hideDeletedEntities,
      ) as FilterAccountDto;

      try {
        return await manager.Accounts.commonGet(commonFilters);
      } catch (error) {
        console.warn(
          "API failed, loading common accounts from IndexedDB",
          error,
        );
        return await offlineManager.Accounts.commonGet(commonFilters);
      }
    },
  });
}
