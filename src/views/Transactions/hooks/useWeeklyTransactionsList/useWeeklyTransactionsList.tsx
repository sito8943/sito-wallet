import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import type { FilterTransactionDto } from "lib";

import { TransactionsQueryKeys } from "hooks";

import { getWeeklyTransactionsDateRange } from "../../utils";
import { WEEKLY_TRANSACTIONS_LIST_QUERY } from "./constants";
import type {
  UseWeeklyTransactionsListPropsType,
  UseWeeklyTransactionsListResultType,
} from "./types";

export function useWeeklyTransactionsList(
  props: UseWeeklyTransactionsListPropsType,
): UseWeeklyTransactionsListResultType {
  const { accountId, type, weekScope, open } = props;

  const { account } = useAuth();

  const manager = useManager();

  const dateRange = useMemo(
    () => getWeeklyTransactionsDateRange(weekScope),
    [weekScope],
  );

  const filters = useMemo<FilterTransactionDto>(
    () => ({
      accountId: accountId ?? undefined,
      type,
      date: {
        start: dateRange.start,
        end: dateRange.end,
      },
      softDeleteScope: "ACTIVE",
    }),
    [accountId, dateRange.end, dateRange.start, type],
  );

  const query = useQuery({
    queryKey: [
      ...TransactionsQueryKeys.all().queryKey,
      "weekly-list",
      WEEKLY_TRANSACTIONS_LIST_QUERY,
      filters,
    ],
    enabled: open && !!account?.id && !!accountId,
    queryFn: () =>
      manager.Transactions.get(WEEKLY_TRANSACTIONS_LIST_QUERY, filters),
  });

  return {
    ...query,
    dateRange,
  };
}
