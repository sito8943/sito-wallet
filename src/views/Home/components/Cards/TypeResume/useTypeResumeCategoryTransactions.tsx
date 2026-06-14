import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import type { FilterTransactionDto, TransactionDto } from "lib";
import { getTransactionCategories } from "lib";

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
    excludedCategoryIds = [],
  } = props;
  const { account } = useAuth();
  const manager = useManager();
  const normalizedExcludedCategoryIds = useMemo(
    () => [...new Set(excludedCategoryIds)].sort((left, right) => left - right),
    [excludedCategoryIds],
  );

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
      normalizedExcludedCategoryIds,
    ],
    enabled: open && !!account?.id && !!accountId && !!startDate && !!endDate,
    queryFn: async () => {
      const response = await manager.Transactions.get(
        TYPE_RESUME_TRANSACTIONS_LIST_QUERY,
        filters,
      );

      if (!normalizedExcludedCategoryIds.length) {
        return response.items;
      }

      const excludedCategoryIdSet = new Set(normalizedExcludedCategoryIds);

      return response.items.filter((transaction: TransactionDto) => {
        const categories = getTransactionCategories(transaction);

        return !categories.some((category) =>
          excludedCategoryIdSet.has(category.id),
        );
      });
    },
  });
};
