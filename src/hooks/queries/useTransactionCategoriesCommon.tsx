import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// providers
import { useManager } from "providers";
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
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();
  const commonFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeCommonFilters(),
        hideDeletedEntities,
      ) as FilterTransactionCategoryDto,
    [hideDeletedEntities],
  );

  return useQuery({
    ...TransactionCategoriesQueryKeys.common(commonFilters),
    enabled: !!account?.id,
    queryFn: () => manager.TransactionCategories.commonGet(commonFilters),
  });
}
