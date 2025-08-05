import { useTranslation } from "react-i18next";

// providers
import { useManager } from "providers";

// hooks
import { useFormDialog, TransactionCategoriesQueryKeys } from "hooks";

// utils
import { dtoToForm, emptyTransactionCategory, formToDto } from "../utils";

// types
import { TransactionCategoryFormType } from "../types";

// lib
import { AddTransactionCategoryDto, TransactionCategoryDto } from "lib";

export function useAddTransactionCategoryDialog() {
  const { t } = useTranslation();

  const manager = useManager();

  const { handleSubmit, ...rest } = useFormDialog<
    TransactionCategoryDto,
    AddTransactionCategoryDto,
    TransactionCategoryDto,
    TransactionCategoryFormType
  >({
    formToDto,
    dtoToForm,
    defaultValues: emptyTransactionCategory,
    mutationFn: (data) => manager.TransactionCategories.insert(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:accounts.forms.add"),
    ...TransactionCategoriesQueryKeys.all(),
  });

  return {
    handleSubmit,
    ...rest,
  };
}
