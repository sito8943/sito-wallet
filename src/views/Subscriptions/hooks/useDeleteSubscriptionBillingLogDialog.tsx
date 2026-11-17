import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useDeleteDialog } from "@sito/dashboard-app";

import {
  AccountsQueryKeys,
  SubscriptionsQueryKeys,
  TransactionsQueryKeys,
} from "hooks";
import { useManager } from "providers";

/**
 * Confirms and deletes a billing log. The API also deletes its transaction
 * (restoring the account balance) and recalculates the renewal dates.
 */
export function useDeleteSubscriptionBillingLogDialog(
  subscriptionId: number | null,
) {
  const { t } = useTranslation();
  const manager = useManager();
  const subscriptionsClient =
    "Subscriptions" in manager ? manager.Subscriptions : null;
  const queryClient = useQueryClient();

  const deleteDialog = useDeleteDialog({
    mutationFn: async (ids) => {
      if (!subscriptionsClient || !subscriptionId)
        throw new Error("subscriptions.featureDisabled");

      const billingLogIds = Array.isArray(ids) ? ids : [ids];
      await Promise.all(
        billingLogIds.map((billingLogId) =>
          subscriptionsClient.deleteBillingLog(subscriptionId, billingLogId),
        ),
      );

      return billingLogIds.length;
    },
    onSuccessMessage: t(
      "_pages:subscriptions.actions.deleteBillingLog.successMessage",
    ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ ...AccountsQueryKeys.all() });
      void queryClient.invalidateQueries({ ...TransactionsQueryKeys.all() });
    },
    ...SubscriptionsQueryKeys.all(),
  });

  return {
    ...deleteDialog,
    title: t("_pages:subscriptions.actions.deleteBillingLog.confirmTitle"),
  };
}
