import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// types
import type { UseBalanceHistoryPropsType } from "./types.ts";

// lib
import type { BalanceHistoryDto, FilterBalanceHistoryDto } from "lib";
import { BalanceHistoryGranularity } from "lib";

import { AccountsQueryKeys } from "./queryKeys/accountsQueryKeys";

export function useBalanceHistory(
  props: UseBalanceHistoryPropsType,
): UseQueryResult<BalanceHistoryDto> {
  const filters = useMemo<FilterBalanceHistoryDto>(
    () => ({
      accountId: props.accountId ?? 0,
      from: props.from ?? "",
      to: props.to ?? "",
      granularity: props.granularity ?? BalanceHistoryGranularity.Day,
    }),
    [props.accountId, props.from, props.to, props.granularity],
  );

  const manager = useManager();
  const { account } = useAuth();

  const { enabled, ...queryKey } = AccountsQueryKeys.balanceHistory(filters);

  return useQuery({
    ...queryKey,
    enabled: !!account?.id && enabled,
    queryFn: () => manager.Accounts.balanceHistory(filters),
  });
}
