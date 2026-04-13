import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { isHttpError, useNotification, usePostDialog } from "@sito/dashboard-app";

import { SubscriptionsQueryKeys } from "hooks";
import { useManager } from "providers";

import { AddSubscriptionDto, SubscriptionDto } from "lib";

import {
  emptyAddSubscriptionForm,
  subscriptionFormToCreateDto,
} from "../utils";
import { SubscriptionFormType } from "../types";

export function useAddSubscriptionDialog() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

  const manager = useManager();
  const subscriptionsClient =
    "Subscriptions" in manager ? manager.Subscriptions : null;

  const queryKey = useMemo(() => SubscriptionsQueryKeys.all().queryKey, []);

  const { handleSubmit, ...rest } = usePostDialog<
    AddSubscriptionDto,
    SubscriptionDto,
    SubscriptionFormType
  >({
    formToDto: subscriptionFormToCreateDto,
    defaultValues: emptyAddSubscriptionForm,
    mutationFn: async (data) => {
      if (!subscriptionsClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      return await subscriptionsClient.insert(data);
    },
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:subscriptions.forms.add"),
    onError: (error) => {
      if (isHttpError(error) && error.status === 400) {
        return showErrorNotification({
          message: String(error.message ?? t("_pages:featureFlags.moduleUnavailable")),
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
