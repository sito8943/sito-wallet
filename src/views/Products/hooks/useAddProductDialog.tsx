import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePostDialog } from "@sito/dashboard-app";

// hooks
import { ProductsQueryKeys, useMutationErrorHandler } from "hooks";

// providers
import { useManager } from "providers";

// lib
import type { AddProductDto } from "lib";

// utils
import { emptyProductForm, productFormToAddDto } from "../utils";

// types
import type { ProductFormType } from "../types";

export function useAddProductDialog() {
  const { t } = useTranslation();
  const handleMutationError = useMutationErrorHandler();
  const manager = useManager();

  return usePostDialog<AddProductDto, number, ProductFormType>({
    formToDto: productFormToAddDto,
    defaultValues: emptyProductForm,
    mutationFn: (data) => manager.Products.insert(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:products.forms.add"),
    onError: (error) =>
      handleMutationError(error, {
        uniqueKey: "_entities:product.name.unique",
        badRequest: { fallbackKey: "_accessibility:errors.500" },
      }),
    ...ProductsQueryKeys.all(),
  });
}
