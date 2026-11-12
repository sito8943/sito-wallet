import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// types
import type { UseAccountRewardsPropsType } from "./types.ts";

// lib
import type { AccountRewardsDto, FilterAccountRewardsDto } from "lib";
import { resolveRewardsMonths } from "lib";

import { AccountsQueryKeys } from "./queryKeys/accountsQueryKeys";

export function useAccountRewards(
  props: UseAccountRewardsPropsType,
): UseQueryResult<AccountRewardsDto> {
  const filters = useMemo<FilterAccountRewardsDto>(
    () => ({
      accountId: props.accountId ?? 0,
      months: resolveRewardsMonths(props.months),
    }),
    [props.accountId, props.months],
  );

  const manager = useManager();
  const { account } = useAuth();

  const { enabled, ...queryKey } = AccountsQueryKeys.rewards(filters);

  return useQuery({
    ...queryKey,
    enabled: !!account?.id && enabled && (props.enabled ?? true),
    queryFn: () =>
      manager.Accounts.getRewards(filters.accountId, filters.months),
  });
}
