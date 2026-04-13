import { useTranslation } from "react-i18next";

import { isHttpError, useNotification, usePutDialog } from "@sito/dashboard-app";

import { SubscriptionsQueryKeys } from "hooks";
import { useManager } from "providers";

import {
  SubscriptionDto,
  UpdateSubscriptionDto,
} from "lib";

import {
  emptySubscriptionForm,
  subscriptionDtoToForm,
  subscriptionFormToUpdateDto,
} from "../utils";
import { SubscriptionFormType } from "../types";

export function useEditSubscriptionDialog() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

  const manager = useManager();
  const subscriptionsClient =
    "Subscriptions" in manager ? manager.Subscriptions : null;

  return usePutDialog<
    SubscriptionDto,
    UpdateSubscriptionDto,
    SubscriptionDto,
    SubscriptionFormType
  >({
    formToDto: subscriptionFormToUpdateDto,
    dtoToForm: subscriptionDtoToForm,
    defaultValues: emptySubscriptionForm,
    getFunction: async (id) => {
      if (!subscriptionsClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      return await subscriptionsClient.getById(id);
    },
    mutationFn: async (data) => {
      if (!subscriptionsClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      return await subscriptionsClient.update(data);
    },
    onSuccessMessage: t("_pages:common.actions.edit.successMessage"),
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
    title: t("_pages:subscriptions.forms.edit"),
    ...SubscriptionsQueryKeys.all(),
  });
}
