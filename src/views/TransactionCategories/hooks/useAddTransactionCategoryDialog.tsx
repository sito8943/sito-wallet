import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePostDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import {
  TransactionCategoriesQueryKeys,
  useMutationErrorHandler,
} from "hooks";

// utils
import { addEmptyTransactionCategory, formToDto } from "../utils";

// types
import type { TransactionCategoryFormType } from "../types";

// lib
import type { AddTransactionCategoryDto, TransactionCategoryDto } from "lib";

export function useAddTransactionCategoryDialog() {
  const { t } = useTranslation();
  const handleMutationError = useMutationErrorHandler();

  const manager = useManager();

  const { handleSubmit, ...rest } = usePostDialog<
    AddTransactionCategoryDto,
    TransactionCategoryDto,
    TransactionCategoryFormType
  >({
    formToDto,
    defaultValues: addEmptyTransactionCategory,
    mutationFn: (data) => manager.TransactionCategories.insert(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:transactionCategories.forms.add"),
    onError: (error) =>
      handleMutationError(error, {
        uniqueKey: "_entities:transactionCategory.name.unique",
      }),
    ...TransactionCategoriesQueryKeys.all(),
  });

  return {
    handleSubmit,
    ...rest,
  };
}
