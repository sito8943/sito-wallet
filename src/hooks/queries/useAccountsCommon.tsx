import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// providers
import { useManager } from "providers";
import { useAuth } from "@sito/dashboard-app";

// lib
import type { CommonAccountDto, FilterAccountDto } from "lib";
import {
  applyHideDeletedEntitiesPreference,
  normalizeCommonFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";

import { AccountsQueryKeys } from "./queryKeys/accountsQueryKeys";
import type { UseAccountsCommonPropsType } from "./types";

export function useAccountsCommon(
  props: UseAccountsCommonPropsType = {},
): UseQueryResult<CommonAccountDto[]> {
  const { enabled = true } = props;
  const manager = useManager();
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();
  const commonFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeCommonFilters(),
        hideDeletedEntities,
      ) as FilterAccountDto,
    [hideDeletedEntities],
  );

  return useQuery({
    ...AccountsQueryKeys.common(commonFilters),
    enabled: !!account?.id && enabled,
    queryFn: () => manager.Accounts.commonGet(commonFilters),
  });
}
