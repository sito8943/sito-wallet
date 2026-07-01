import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import { usePutDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import {
  TransactionCategoriesQueryKeys,
  TransactionsQueryKeys,
  useMutationErrorHandler,
} from "hooks";

// utils
import { dtoToForm, emptyTransactionCategory, formToDto } from "../utils";

// types
import type { TransactionCategoryFormType } from "../types";

// lib
import type { UpdateTransactionCategoryDto, TransactionCategoryDto } from "lib";

export function useEditTransactionCategoryDialog() {
  const { t } = useTranslation();
  const handleMutationError = useMutationErrorHandler();
  const queryClient = useQueryClient();

  const manager = useManager();

  return usePutDialog<
    TransactionCategoryDto,
    UpdateTransactionCategoryDto,
    TransactionCategoryDto,
    TransactionCategoryFormType
  >({
    formToDto,
    dtoToForm,
    defaultValues: emptyTransactionCategory,
    getFunction: (id: number) => manager.TransactionCategories.getById(id),
    mutationFn: (data) => manager.TransactionCategories.update(data),
    onSuccessMessage: t("_pages:common.actions.edit.successMessage"),
    title: t("_pages:transactionCategories.forms.edit"),
    onError: (error) =>
      handleMutationError(error, {
        uniqueKey: "_entities:transactionCategory.name.unique",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ ...TransactionsQueryKeys.all() });
    },
    ...TransactionCategoriesQueryKeys.all(),
  });
}
