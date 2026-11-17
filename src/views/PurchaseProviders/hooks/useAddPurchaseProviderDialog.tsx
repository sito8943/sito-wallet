import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePostDialog } from "@sito/dashboard-app";

// hooks
import { PurchaseProvidersQueryKeys, useMutationErrorHandler } from "hooks";

// providers
import { useManager } from "providers";

// lib
import type { CommonPurchaseProviderDto } from "lib";

// utils
import {
  emptyPurchaseProviderForm,
  purchaseProviderFormToAddDto,
} from "../utils";

// types
import type {
  CreatePurchaseProviderMutationDto,
  PurchaseProviderFormType,
  UseAddPurchaseProviderDialogOptions,
} from "../types";

export function useAddPurchaseProviderDialog(
  options: UseAddPurchaseProviderDialogOptions = {},
) {
  const { t } = useTranslation();
  const handleMutationError = useMutationErrorHandler();
  const manager = useManager();

  return usePostDialog<
    CreatePurchaseProviderMutationDto,
    CommonPurchaseProviderDto,
    PurchaseProviderFormType
  >({
    formToDto: purchaseProviderFormToAddDto,
    defaultValues: emptyPurchaseProviderForm,
    mutationFn: async ({ payload, file }) => {
      const id = await manager.PurchaseProviders.insert(payload);
      if (file) return await manager.PurchaseProviders.updatePhoto(id, file);
      return {
        id,
        name: payload.name,
        photo: payload.photo ?? null,
        updatedAt: new Date(),
      };
    },
    onSuccess: options.onCreated,
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:purchaseProviders.forms.add"),
    onError: (error) =>
      handleMutationError(error, {
        uniqueKey: "_entities:purchaseProvider.name.unique",
        badRequest: { fallbackKey: "_accessibility:errors.500" },
      }),
    ...PurchaseProvidersQueryKeys.all(),
  });
}
