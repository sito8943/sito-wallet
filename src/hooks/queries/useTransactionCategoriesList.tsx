import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";
import type { QueryResult } from "@sito/dashboard-app";
import { useAuth } from "@sito/dashboard-app";

// types
import type { UseFetchPropsType } from "./types.ts";

// lib
import type { TransactionCategoryDto, FilterTransactionCategoryDto } from "lib";
import {
  applyHideDeletedEntitiesPreference,
  defaultTransactionCategoriesListFilters,
  fetchTransactionCategoriesList,
  normalizeListFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";

import { TransactionCategoriesQueryKeys } from "./queryKeys/transactionCategoriesQueryKeys";

export function useTransactionCategoriesList(
  props: UseFetchPropsType<
    TransactionCategoryDto,
    FilterTransactionCategoryDto
  >,
): UseQueryResult<QueryResult<TransactionCategoryDto>> {
  const { filters = defaultTransactionCategoriesListFilters } = props;
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const normalizedFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeListFilters(filters),
        hideDeletedEntities,
      ) as FilterTransactionCategoryDto,
    [filters, hideDeletedEntities],
  );

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...TransactionCategoriesQueryKeys.list(normalizedFilters),
    enabled: !!account?.id,
    queryFn: () =>
      fetchTransactionCategoriesList(
        manager,
        offlineManager,
        normalizedFilters,
      ),
  });
}
