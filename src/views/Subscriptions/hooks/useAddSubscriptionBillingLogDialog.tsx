import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

import { useNotification, usePostDialog } from "@sito/dashboard-app";

import { SubscriptionsQueryKeys } from "hooks";
import { useManager } from "providers";

import type { AddSubscriptionBillingLogDto, SubscriptionDto } from "lib";

import {
  emptySubscriptionBillingLogForm,
  subscriptionBillingLogFormToDto,
} from "../utils";
import type { SubscriptionBillingLogFormType } from "../types";
import { useAddSubscriptionBillingLogAction } from "./useAddSubscriptionBillingLogAction";

export function useAddSubscriptionBillingLogDialog() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { showErrorNotification } = useNotification();

  const manager = useManager();
  const subscriptionsClient =
    "Subscriptions" in manager ? manager.Subscriptions : null;

  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionDto | null>(null);
  const [resolvingSubscriptionId, setResolvingSubscriptionId] = useState<
    number | null
  >(null);

  const formDialog = usePostDialog<
    AddSubscriptionBillingLogDto,
    number,
    SubscriptionBillingLogFormType
  >({
    formToDto: subscriptionBillingLogFormToDto,
    defaultValues: emptySubscriptionBillingLogForm,
    mutationFn: async (data) => {
      if (!subscriptionsClient || !selectedSubscription) {
        throw new Error("Subscription not found with id: 0");
      }

      return await subscriptionsClient.createBillingLog(
        selectedSubscription.id,
        data,
      );
    },
    onSuccessMessage: t(
      "_pages:subscriptions.actions.billingLog.successMessage",
    ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        ...SubscriptionsQueryKeys.all(),
      });
      setSelectedSubscription(null);
    },
    title: t("_pages:subscriptions.actions.billingLog.title"),
    ...SubscriptionsQueryKeys.all(),
  });

  const openDialogForSubscription = useCallback(
    (record: SubscriptionDto) => {
      setSelectedSubscription(record);
      formDialog.openDialog();
    },
    [formDialog],
  );

  const openDialogBySubscriptionId = useCallback(
    async (subscriptionId: number) => {
      if (!subscriptionsClient) {
        showErrorNotification({
          message: t("_pages:featureFlags.moduleUnavailable"),
        });
        return;
      }

      setResolvingSubscriptionId(subscriptionId);

      try {
        const subscription = await subscriptionsClient.getById(subscriptionId);
        openDialogForSubscription(subscription);
      } catch (error) {
        showErrorNotification({
          message:
            error instanceof Error
              ? error.message
              : t("_accessibility:errors.500"),
        });
      } finally {
        setResolvingSubscriptionId(null);
      }
    },
    [openDialogForSubscription, showErrorNotification, subscriptionsClient, t],
  );

  const handleClose = useCallback(() => {
    setSelectedSubscription(null);
    formDialog.handleClose();
  }, [formDialog]);

  const { action } = useAddSubscriptionBillingLogAction({
    onClick: openDialogForSubscription,
  });

  return {
    ...formDialog,
    action,
    handleClose,
    openDialogBySubscriptionId,
    openDialogForSubscription,
    resolvingSubscriptionId,
    selectedSubscription,
  };
}
