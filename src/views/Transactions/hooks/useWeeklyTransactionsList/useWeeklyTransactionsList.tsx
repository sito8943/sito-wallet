import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@sito/dashboard-app";

import { useManager, useOfflineManager } from "providers";

import { FilterTransactionDto } from "lib";

import { TransactionsQueryKeys } from "hooks";

import { getWeeklyTransactionsDateRange } from "../../utils";
import { WEEKLY_TRANSACTIONS_LIST_QUERY } from "./constants";
import {
  UseWeeklyTransactionsListPropsType,
  UseWeeklyTransactionsListResultType,
} from "./types";

export function useWeeklyTransactionsList(
  props: UseWeeklyTransactionsListPropsType,
): UseWeeklyTransactionsListResultType {
  const { accountId, type, weekScope, open } = props;

  const { account } = useAuth();

  const manager = useManager();
  const offlineManager = useOfflineManager();

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
    queryFn: async () => {
      try {
        const result = await manager.Transactions.get(
          WEEKLY_TRANSACTIONS_LIST_QUERY,
          filters,
        );

        await offlineManager.Transactions.seed(result.items).catch(() => {});

        return result;
      } catch (error) {
        console.warn("API failed, loading weekly transactions from IndexedDB", error);

        return await offlineManager.Transactions.get(
          WEEKLY_TRANSACTIONS_LIST_QUERY,
          filters,
        );
      }
    },
  });

  return {
    ...query,
    dateRange,
  };
}
