import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

import { usePostDialog } from "@sito/dashboard-app";

import { SubscriptionsQueryKeys } from "hooks";
import { useManager } from "providers";

import {
  AddSubscriptionBillingLogDto,
  SubscriptionDto,
} from "lib";

import {
  emptySubscriptionBillingLogForm,
  subscriptionBillingLogFormToDto,
} from "../utils";
import { SubscriptionBillingLogFormType } from "../types";
import { useAddSubscriptionBillingLogAction } from "./useAddSubscriptionBillingLogAction";

export function useAddSubscriptionBillingLogDialog() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const manager = useManager();
  const subscriptionsClient =
    "Subscriptions" in manager ? manager.Subscriptions : null;

  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionDto | null>(null);

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
    onSuccessMessage: t("_pages:subscriptions.actions.billingLog.successMessage"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        ...SubscriptionsQueryKeys.all(),
      });
      setSelectedSubscription(null);
    },
    title: t("_pages:subscriptions.actions.billingLog.title"),
    ...SubscriptionsQueryKeys.all(),
  });

  const handleOpen = useCallback(
    (record: SubscriptionDto) => {
      setSelectedSubscription(record);
      formDialog.openDialog();
    },
    [formDialog],
  );

  const { action } = useAddSubscriptionBillingLogAction({
    onClick: handleOpen,
  });

  return {
    ...formDialog,
    action,
    selectedSubscription,
  };
}
