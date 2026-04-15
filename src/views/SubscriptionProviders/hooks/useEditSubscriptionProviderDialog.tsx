import { useTranslation } from "react-i18next";

import { isHttpError, useNotification, usePutDialog } from "@sito/dashboard-app";

import { SubscriptionProvidersQueryKeys } from "hooks";
import { useManager } from "providers";

import {
  SubscriptionProviderDto,
} from "lib";

import {
  emptySubscriptionProviderForm,
  subscriptionProviderDtoToForm,
  subscriptionProviderFormToUpdateDto,
} from "../utils";
import {
  SubscriptionProviderFormType,
  UpdateSubscriptionProviderMutationDto,
} from "../types";

export function useEditSubscriptionProviderDialog() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

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
    onError: (error) => {
      if (isHttpError(error) && (error.status === 400 || error.status === 409)) {
        return showErrorNotification({
          message: String(error.message ?? t("_accessibility:errors.500")),
        });
      }

      return showErrorNotification({
        message: t("_accessibility:errors.500"),
      });
    },
    ...SubscriptionProvidersQueryKeys.all(),
  });
}
