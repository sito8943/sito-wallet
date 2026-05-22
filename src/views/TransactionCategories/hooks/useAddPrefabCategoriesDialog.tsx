import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { useAuth, useNotification, usePostDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// components
import { PREFAB_CATEGORIES } from "components";

// hooks
import { TransactionCategoriesQueryKeys } from "hooks";

// lib
import { TransactionType } from "lib";
import type { AddTransactionCategoryDto, TransactionCategoryDto } from "lib";

// types
import type { PrefabCategoriesFormType } from "../types";

export function useAddPrefabCategoriesDialog() {
  const { t } = useTranslation();
  const { account } = useAuth();
  const { showErrorNotification } = useNotification();
  const manager = useManager();

  const queryKey = useMemo(
    () => TransactionCategoriesQueryKeys.all().queryKey,
    [],
  );

  const defaultValues = useMemo<PrefabCategoriesFormType>(
    () => ({ keys: PREFAB_CATEGORIES.map((c) => c.key) }),
    [],
  );

  const { handleSubmit, ...rest } = usePostDialog<
    AddTransactionCategoryDto[],
    TransactionCategoryDto,
    PrefabCategoriesFormType
  >({
    defaultValues,
    formToDto: (form) =>
      form.keys
        .map((key) => {
          const prefab = PREFAB_CATEGORIES.find((c) => c.key === key);
          if (!prefab) return null;
          return {
            name: t(`_pages:prefabs.categories.items.${key}.name`),
            description: "",
            color: prefab.color,
            userId: account?.id ?? 0,
            type:
              prefab.type === "income"
                ? TransactionType.In
                : TransactionType.Out,
          };
        })
        .filter((v): v is AddTransactionCategoryDto => v !== null),
    mutationFn: (data) => manager.TransactionCategories.insertMany(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:prefabs.dialog.categoriesTitle"),
    onError: () =>
      showErrorNotification({ message: t("_accessibility:errors.500") }),
    queryKey,
  });

  return { handleSubmit, ...rest };
}
