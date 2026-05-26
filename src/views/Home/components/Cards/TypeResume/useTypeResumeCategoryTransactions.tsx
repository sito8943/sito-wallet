import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import type { FilterTransactionDto } from "lib";

import { TransactionsQueryKeys } from "hooks";

import { TYPE_RESUME_TRANSACTIONS_LIST_QUERY } from "./constants";
import type { UseTypeResumeCategoryTransactionsPropsType } from "./types";

export const useTypeResumeCategoryTransactions = (
  props: UseTypeResumeCategoryTransactionsPropsType,
) => {
  const {
    accountId,
    categoryId,
    type,
    startDate = "",
    endDate = "",
    open,
  } = props;
  const { account } = useAuth();
  const manager = useManager();

  const filters = useMemo<FilterTransactionDto>(
    () => ({
      accountId: accountId ?? undefined,
      type,
      category: [categoryId],
      date: {
        start: startDate,
        end: endDate,
      },
      softDeleteScope: "ACTIVE",
    }),
    [accountId, categoryId, endDate, startDate, type],
  );

  return useQuery({
    queryKey: [
      ...TransactionsQueryKeys.all().queryKey,
      "type-resume-category-transactions",
      TYPE_RESUME_TRANSACTIONS_LIST_QUERY,
      filters,
    ],
    enabled: open && !!account?.id && !!accountId && !!startDate && !!endDate,
    queryFn: () =>
      manager.Transactions.get(TYPE_RESUME_TRANSACTIONS_LIST_QUERY, filters),
  });
};
