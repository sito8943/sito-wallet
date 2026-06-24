import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { usePostDialog } from "@sito/dashboard-app";

import {
  SubscriptionProvidersQueryKeys,
  useMutationErrorHandler,
} from "hooks";
import { useManager } from "providers";

import type { SubscriptionProviderDto } from "lib";

import {
  emptyAddSubscriptionProviderForm,
  getProviderId,
  subscriptionProviderFormToCreateDto,
} from "../utils";
import type {
  CreateSubscriptionProviderMutationDto,
  SubscriptionProviderFormType,
} from "../types";

export function useAddSubscriptionProviderDialog() {
  const { t } = useTranslation();
  const handleMutationError = useMutationErrorHandler();

  const manager = useManager();
  const subscriptionProvidersClient =
    "SubscriptionProviders" in manager ? manager.SubscriptionProviders : null;

  const queryKey = useMemo(
    () => SubscriptionProvidersQueryKeys.all().queryKey,
    [],
  );

  const { handleSubmit, ...rest } = usePostDialog<
    CreateSubscriptionProviderMutationDto,
    SubscriptionProviderDto,
    SubscriptionProviderFormType
  >({
    formToDto: subscriptionProviderFormToCreateDto,
    defaultValues: emptyAddSubscriptionProviderForm,
    mutationFn: async ({ payload, file }) => {
      if (!subscriptionProvidersClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      const created = await subscriptionProvidersClient.insert(payload);
      if (!file) return created;

      const providerId = getProviderId(created);
      if (!providerId) {
        throw new Error("subscriptionProvider.idNotReturned");
      }

      return await subscriptionProvidersClient.updatePhoto(providerId, file);
    },
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:subscriptionProviders.forms.add"),
    onError: (error) =>
      handleMutationError(error, {
        uniqueKey: "_entities:subscriptionProvider.name.unique",
        badRequest: { fallbackKey: "_accessibility:errors.500" },
      }),
    queryKey,
  });

  return {
    handleSubmit,
    ...rest,
  };
}
