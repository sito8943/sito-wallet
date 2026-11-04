import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// providers
import { useManager } from "providers";
import { useAuth } from "@sito/dashboard-app";

// lib
import type { CommonCurrencyDto, FilterCurrencyDto } from "lib";
import {
  applyHideDeletedEntitiesPreference,
  normalizeCommonFilters,
} from "lib";
import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";

import { CurrenciesQueryKeys } from "./queryKeys/currenciesQueryKeys";
import { useCatalogSelect } from "./useCatalogSelect";
import type { UseCatalogCommonProps } from "./types";

export function useCurrenciesCommon(
  props: UseCatalogCommonProps = {},
): UseQueryResult<CommonCurrencyDto[]> {
  const { includeShared = false } = props;
  const select = useCatalogSelect<CommonCurrencyDto>(includeShared);
  const manager = useManager();
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();
  const commonFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeCommonFilters(),
        hideDeletedEntities,
      ) as FilterCurrencyDto,
    [hideDeletedEntities],
  );

  return useQuery({
    ...CurrenciesQueryKeys.common(commonFilters),
    enabled: !!account?.id,
    queryFn: () => manager.Currencies.commonGet(commonFilters),
    select,
  });
}
