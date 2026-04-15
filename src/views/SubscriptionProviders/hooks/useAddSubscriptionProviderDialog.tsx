import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { isHttpError, useNotification, usePostDialog } from "@sito/dashboard-app";

import { SubscriptionProvidersQueryKeys } from "hooks";
import { useManager } from "providers";

import {
  SubscriptionProviderDto,
} from "lib";

import {
  emptyAddSubscriptionProviderForm,
  subscriptionProviderFormToCreateDto,
} from "../utils";
import {
  CreateSubscriptionProviderMutationDto,
  SubscriptionProviderFormType,
} from "../types";

const getProviderId = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "object" && value !== null) {
    const maybeValue = value as { id?: unknown };
    const parsedId = Number(maybeValue.id);
    if (Number.isFinite(parsedId)) return parsedId;
  }
  return null;
};

export function useAddSubscriptionProviderDialog() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

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
    queryKey,
  });

  return {
    handleSubmit,
    ...rest,
  };
}
