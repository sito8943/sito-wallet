import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePostDialog } from "@sito/dashboard-app";

// hooks
import { ProductsQueryKeys, useMutationErrorHandler } from "hooks";

// providers
import { useManager } from "providers";

// utils
import { emptyProductForm, productFormToAddDto } from "../utils";

// types
import type { CreateProductMutationDto, ProductFormType } from "../types";

export function useAddProductDialog() {
  const { t } = useTranslation();
  const handleMutationError = useMutationErrorHandler();
  const manager = useManager();

  return usePostDialog<CreateProductMutationDto, number, ProductFormType>({
    formToDto: productFormToAddDto,
    defaultValues: emptyProductForm,
    mutationFn: async ({ payload, file }) => {
      const id = await manager.Products.insert(payload);
      if (file) await manager.Products.updatePhoto(id, file);
      return id;
    },
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
