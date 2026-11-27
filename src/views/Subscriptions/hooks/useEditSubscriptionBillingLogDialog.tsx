import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useNotification, usePutDialog } from "@sito/dashboard-app";

import {
  AccountsQueryKeys,
  SubscriptionsQueryKeys,
  TransactionsQueryKeys,
} from "hooks";
import { useManager } from "providers";

import type {
  SubscriptionBillingLogDto,
  SubscriptionDto,
  UpdateSubscriptionBillingLogDto,
} from "lib";
import { parseErrorMessage } from "lib";

import type { SubscriptionBillingLogFormType } from "../types";
import {
  emptySubscriptionBillingLogForm,
  subscriptionBillingLogDtoToForm,
  subscriptionBillingLogFormToUpdateDto,
} from "../utils";

/**
 * Edits a billing log. The API also moves its transaction (and the account
 * balance) and recalculates the renewal dates from the latest payment.
 */
export function useEditSubscriptionBillingLogDialog(
  selectedSubscription: SubscriptionDto | null,
) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { showErrorNotification } = useNotification();
  const manager = useManager();
  const subscriptionsClient =
    "Subscriptions" in manager ? manager.Subscriptions : null;

  const formDialog = usePutDialog<
    SubscriptionBillingLogDto,
    UpdateSubscriptionBillingLogDto,
    number,
    SubscriptionBillingLogFormType
  >({
    defaultValues: emptySubscriptionBillingLogForm,
    dtoToForm: subscriptionBillingLogDtoToForm,
    formToDto: (form, dto) =>
      subscriptionBillingLogFormToUpdateDto(
        { ...form, subscriptionId: selectedSubscription?.id ?? 0 },
        dto,
      ),
    getFunction: async (billingLogId) => {
      if (!subscriptionsClient || !selectedSubscription) {
        throw new Error("subscriptions.featureDisabled");
      }

      return await subscriptionsClient.getBillingLogById(
        selectedSubscription.id,
        billingLogId,
      );
    },
    mutationFn: async (data) => {
      if (!subscriptionsClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      return await subscriptionsClient.updateBillingLog(data);
    },
    onSuccessMessage: t(
      "_pages:subscriptions.actions.editBillingLog.successMessage",
    ),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ ...AccountsQueryKeys.all() }),
        queryClient.invalidateQueries({ ...TransactionsQueryKeys.all() }),
      ]);
    },
    onError: (error) => {
      showErrorNotification({
        message: parseErrorMessage(error, t("_accessibility:errors.500")),
      });
    },
    title: t("_pages:subscriptions.actions.editBillingLog.title"),
    ...SubscriptionsQueryKeys.all(),
  });

  return {
    ...formDialog,
    editingBillingLog: true,
    selectedSubscription,
  };
}
