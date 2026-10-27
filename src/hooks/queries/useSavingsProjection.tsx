import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// types
import type { UseSavingsProjectionPropsType } from "./types.ts";

// lib
import type { FilterSavingsProjectionDto, SavingsProjectionDto } from "lib";
import { SavingsProjectionHorizon } from "lib";

import { AccountsQueryKeys } from "./queryKeys/accountsQueryKeys";

export function useSavingsProjection(
  props: UseSavingsProjectionPropsType,
): UseQueryResult<SavingsProjectionDto> {
  const filters = useMemo<FilterSavingsProjectionDto>(
    () => ({
      accountId: props.accountId ?? 0,
      horizon: props.horizon ?? SavingsProjectionHorizon.OneYear,
    }),
    [props.accountId, props.horizon],
  );

  const manager = useManager();
  const { account } = useAuth();

  const { enabled, ...queryKey } = AccountsQueryKeys.savingsProjection(filters);

  return useQuery({
    ...queryKey,
    enabled: !!account?.id && enabled,
    queryFn: () => manager.Accounts.savingsProjection(filters),
  });
}
