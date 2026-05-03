import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useNotification } from "@sito/dashboard-app";

import { SubscriptionsQueryKeys } from "hooks";
import { SubscriptionDto } from "lib";
import { useManager } from "providers";

import { useAddSubscriptionRenewalAction } from "./useAddSubscriptionRenewalAction";

export function useAddSubscriptionRenewalMutation() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const manager = useManager();
  const { showErrorNotification, showSuccessNotification } = useNotification();

  const subscriptionsClient =
    "Subscriptions" in manager ? manager.Subscriptions : null;

  const mutate = useMutation<number, Error, SubscriptionDto>({
    mutationFn: async (subscription) => {
      if (!subscriptionsClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      return await subscriptionsClient.createRenewal(subscription.id);
    },
    onError: (error) => {
      showErrorNotification({ message: error.message });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        ...SubscriptionsQueryKeys.all(),
      });

      showSuccessNotification({
        message: t("_pages:subscriptions.actions.renewal.successMessage"),
      });
    },
  });

  const handleClick = useCallback(
    (record: SubscriptionDto) => {
      mutate.mutate(record);
    },
    [mutate],
  );

  const { action } = useAddSubscriptionRenewalAction({
    onClick: handleClick,
    isLoading: mutate.isPending,
  });

  return {
    action,
  };
}
