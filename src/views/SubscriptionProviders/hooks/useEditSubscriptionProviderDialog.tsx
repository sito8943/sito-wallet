import { useTranslation } from "react-i18next";

import { usePutDialog } from "@sito/dashboard-app";

import {
  SubscriptionProvidersQueryKeys,
  useMutationErrorHandler,
} from "hooks";
import { useManager } from "providers";

import type { SubscriptionProviderDto } from "lib";

import {
  emptySubscriptionProviderForm,
  subscriptionProviderDtoToForm,
  subscriptionProviderFormToUpdateDto,
} from "../utils";
import type {
  SubscriptionProviderFormType,
  UpdateSubscriptionProviderMutationDto,
} from "../types";

export function useEditSubscriptionProviderDialog() {
  const { t } = useTranslation();
  const handleMutationError = useMutationErrorHandler();

  const manager = useManager();
  const subscriptionProvidersClient =
    "SubscriptionProviders" in manager ? manager.SubscriptionProviders : null;

  return usePutDialog<
    SubscriptionProviderDto,
    UpdateSubscriptionProviderMutationDto,
    SubscriptionProviderDto,
    SubscriptionProviderFormType
  >({
    formToDto: subscriptionProviderFormToUpdateDto,
    dtoToForm: subscriptionProviderDtoToForm,
    defaultValues: emptySubscriptionProviderForm,
    getFunction: async (id) => {
      if (!subscriptionProvidersClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      return await subscriptionProvidersClient.getById(id);
    },
    mutationFn: async ({ payload, file, removePhoto }) => {
      if (!subscriptionProvidersClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      const updated = await subscriptionProvidersClient.update(payload);
      if (file) {
        return await subscriptionProvidersClient.updatePhoto(payload.id, file);
      }
      if (removePhoto) {
        return await subscriptionProvidersClient.deletePhoto(payload.id);
      }

      return updated;
    },
    onSuccessMessage: t("_pages:common.actions.edit.successMessage"),
    title: t("_pages:subscriptionProviders.forms.edit"),
    onError: (error) =>
      handleMutationError(error, {
        uniqueKey: "_entities:subscriptionProvider.name.unique",
        badRequest: { fallbackKey: "_accessibility:errors.500" },
      }),
    ...SubscriptionProvidersQueryKeys.all(),
  });
}
