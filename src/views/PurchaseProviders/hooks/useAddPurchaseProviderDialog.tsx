import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePostDialog } from "@sito/dashboard-app";

// hooks
import { PurchaseProvidersQueryKeys, useMutationErrorHandler } from "hooks";

// providers
import { useManager } from "providers";

// lib

// utils
import {
  emptyPurchaseProviderForm,
  purchaseProviderFormToAddDto,
} from "../utils";

// types
import type {
  CreatePurchaseProviderMutationDto,
  PurchaseProviderFormType,
} from "../types";

export function useAddPurchaseProviderDialog() {
  const { t } = useTranslation();
  const handleMutationError = useMutationErrorHandler();
  const manager = useManager();

  return usePostDialog<
    CreatePurchaseProviderMutationDto,
    number,
    PurchaseProviderFormType
  >({
    formToDto: purchaseProviderFormToAddDto,
    defaultValues: emptyPurchaseProviderForm,
    mutationFn: async ({ payload, file }) => {
      const id = await manager.PurchaseProviders.insert(payload);
      if (file) await manager.PurchaseProviders.updatePhoto(id, file);
      return id;
    },
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
