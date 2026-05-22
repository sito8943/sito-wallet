import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// providers
import { useManager } from "providers";

// types
import type { UseTransactionTypeResumePropsType } from "./types.ts";

// lib
import type { CommonTransactionDto, FilterTransactionDto } from "lib";
import {
  applyHideDeletedEntitiesPreference,
  normalizeCommonFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";

import { TransactionsQueryKeys } from "./queryKeys/transactionsQueryKeys";

export function useTransactionsCommon(
  props: UseTransactionTypeResumePropsType,
): UseQueryResult<CommonTransactionDto[]> {
  const manager = useManager();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const filters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeCommonFilters(props),
        hideDeletedEntities,
      ) as FilterTransactionDto,
    [props, hideDeletedEntities],
  );

  return useQuery({
    ...TransactionsQueryKeys.common(filters),
    queryFn: () => manager.Transactions.commonGet(filters),
  });
}
