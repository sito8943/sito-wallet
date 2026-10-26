import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePutDialog } from "@sito/dashboard-app";

// hooks
import { PurchaseProvidersQueryKeys, useMutationErrorHandler } from "hooks";

// providers
import { useManager } from "providers";

// lib
import type { PurchaseProviderDto } from "lib";

// utils
import {
  emptyPurchaseProviderForm,
  purchaseProviderDtoToForm,
  purchaseProviderFormToUpdateDto,
} from "../utils";

// types
import type {
  PurchaseProviderFormType,
  UpdatePurchaseProviderMutationDto,
} from "../types";

export function useEditPurchaseProviderDialog() {
  const { t } = useTranslation();
  const handleMutationError = useMutationErrorHandler();
  const manager = useManager();

  return usePutDialog<
    PurchaseProviderDto,
    UpdatePurchaseProviderMutationDto,
    number,
    PurchaseProviderFormType
  >({
    formToDto: purchaseProviderFormToUpdateDto,
    dtoToForm: purchaseProviderDtoToForm,
    defaultValues: emptyPurchaseProviderForm,
    getFunction: (id) => manager.PurchaseProviders.getById(id),
    mutationFn: async ({ payload, file }) => {
      const id = await manager.PurchaseProviders.update(payload);
      if (file) await manager.PurchaseProviders.updatePhoto(payload.id, file);
      return id;
    },
    onSuccessMessage: t("_pages:common.actions.edit.successMessage"),
    title: t("_pages:purchaseProviders.forms.edit"),
    onError: (error) =>
      handleMutationError(error, {
        uniqueKey: "_entities:purchaseProvider.name.unique",
        badRequest: { fallbackKey: "_accessibility:errors.500" },
      }),
    ...PurchaseProvidersQueryKeys.all(),
  });
}
