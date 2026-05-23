import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePostDialog } from "@sito/dashboard-app";

// providers
import { useManager, useOnboardingDraft } from "providers";

// hooks
import { TransactionCategoriesQueryKeys } from "hooks";

// utils
import { addEmptyTransactionCategory, formToDto } from "../utils";

// types
import type { TransactionCategoryFormType } from "../types";

// lib
import type { AddTransactionCategoryDto, TransactionCategoryDto } from "lib";

export function useAddTransactionCategoryDialog() {
  const { t } = useTranslation();

  const manager = useManager();
  const { isAnonymous, addTransactionCategories } = useOnboardingDraft();

  const { handleSubmit, ...rest } = usePostDialog<
    AddTransactionCategoryDto,
    TransactionCategoryDto,
    TransactionCategoryFormType
  >({
    formToDto,
    defaultValues: addEmptyTransactionCategory,
    mutationFn: async (data) => {
      if (isAnonymous) {
        const [added] = addTransactionCategories([
          {
            name: data.name,
            description: data.description,
            color: data.color,
            type: data.type,
          },
        ]);
        return {
          id: added.localId,
          name: added.name,
          description: added.description,
          color: added.color,
          type: added.type,
          auto: false,
          user: null,
        } as TransactionCategoryDto;
      }
      return manager.TransactionCategories.insert(data);
    },
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:transactionCategories.forms.add"),
    ...TransactionCategoriesQueryKeys.all(),
  });

  return {
    handleSubmit,
    ...rest,
  };
}
