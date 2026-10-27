import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// types
import type { UseSavingsProjectionDailyPropsType } from "./types.ts";

// lib
import type {
  FilterSavingsProjectionDailyDto,
  SavingsProjectionDailyDto,
} from "lib";

import { AccountsQueryKeys } from "./queryKeys/accountsQueryKeys";

export function useSavingsProjectionDaily(
  props: UseSavingsProjectionDailyPropsType,
): UseQueryResult<SavingsProjectionDailyDto> {
  const filters = useMemo<FilterSavingsProjectionDailyDto>(
    () => ({
      accountId: props.accountId ?? 0,
      month: props.month ?? "",
    }),
    [props.accountId, props.month],
  );

  const manager = useManager();
  const { account } = useAuth();

  const { enabled, ...queryKey } =
    AccountsQueryKeys.savingsProjectionDaily(filters);

  return useQuery({
    ...queryKey,
    enabled: !!account?.id && enabled,
    queryFn: () => manager.Accounts.savingsProjectionDaily(filters),
  });
}
