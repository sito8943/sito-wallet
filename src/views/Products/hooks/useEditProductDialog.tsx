import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePutDialog } from "@sito/dashboard-app";

// hooks
import { ProductsQueryKeys, useMutationErrorHandler } from "hooks";

// providers
import { useManager } from "providers";

// lib
import type { ProductDto } from "lib";

// utils
import {
  emptyProductForm,
  productDtoToForm,
  productFormToUpdateDto,
} from "../utils";

// types
import type { ProductFormType, UpdateProductMutationDto } from "../types";

export function useEditProductDialog() {
  const { t } = useTranslation();
  const handleMutationError = useMutationErrorHandler();
  const manager = useManager();

  return usePutDialog<
    ProductDto,
    UpdateProductMutationDto,
    number,
    ProductFormType
  >({
    formToDto: productFormToUpdateDto,
    dtoToForm: productDtoToForm,
    defaultValues: emptyProductForm,
    getFunction: (id) => manager.Products.getById(id),
    mutationFn: async ({ payload, file }) => {
      const id = await manager.Products.update(payload);
      if (file) await manager.Products.updatePhoto(payload.id, file);
      return id;
    },
    onSuccessMessage: t("_pages:common.actions.edit.successMessage"),
    title: t("_pages:products.forms.edit"),
    onError: (error) =>
      handleMutationError(error, {
        uniqueKey: "_entities:product.name.unique",
        badRequest: { fallbackKey: "_accessibility:errors.500" },
      }),
    ...ProductsQueryKeys.all(),
  });
}
