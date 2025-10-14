import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { useFormDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { TransactionCategoriesQueryKeys } from "hooks";

// utils
import { dtoToForm, emptyTransactionCategory, formToDto } from "../utils";

// types
import { TransactionCategoryFormType } from "../types";

// lib
import { UpdateTransactionCategoryDto, TransactionCategoryDto } from "lib";

export function useEditTransactionCategoryDialog() {
  const { t } = useTranslation();

  const manager = useManager();

  return useFormDialog<
    TransactionCategoryDto,
    UpdateTransactionCategoryDto,
    TransactionCategoryDto,
    TransactionCategoryFormType
  >({
    formToDto,
    dtoToForm,
    defaultValues: emptyTransactionCategory,
    getFunction: (id) => manager.TransactionCategories.getById(id),
    mutationFn: (data) => manager.TransactionCategories.update(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:accounts.forms.edit"),
    ...TransactionCategoriesQueryKeys.all(),
  });
}
