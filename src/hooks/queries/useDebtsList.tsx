import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { QueryResult } from "@sito/dashboard-app";
import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import type { DebtDto, FilterDebtDto } from "lib";
import {
  applyHideDeletedEntitiesPreference,
  defaultDebtsListFilters,
  normalizeListFilters,
} from "lib";

import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";
import type { UseFetchPropsType } from "./types";
import { DebtsQueryKeys } from "./queryKeys/debtsQueryKeys";

export function useDebtsList(
  props: UseFetchPropsType<DebtDto, FilterDebtDto>,
): UseQueryResult<QueryResult<DebtDto>> {
  const { filters = defaultDebtsListFilters } = props;
  const manager = useManager();
  const debtsClient = "Debts" in manager ? manager.Debts : null;
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const normalizedFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeListFilters(filters),
        hideDeletedEntities,
      ) as FilterDebtDto,
    [filters, hideDeletedEntities],
  );

  return useQuery({
    ...DebtsQueryKeys.list(normalizedFilters),
    enabled: !!account?.id && !!debtsClient,
    queryFn: () => {
      if (!debtsClient) {
        throw new Error("debts.featureDisabled");
      }

      return debtsClient.get(undefined, normalizedFilters);
    },
  });
}
