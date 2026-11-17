import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useDeleteDialog } from "@sito/dashboard-app";

import { AccountsQueryKeys, DebtsQueryKeys } from "hooks";
import { useManager } from "providers";

export function useDeleteDebtPaymentDialog(debtId: number | null) {
  const { t } = useTranslation();
  const manager = useManager();
  const debtsClient = "Debts" in manager ? manager.Debts : null;
  const queryClient = useQueryClient();

  const deleteDialog = useDeleteDialog({
    mutationFn: async (ids) => {
      if (!debtsClient || !debtId) throw new Error("debts.featureDisabled");

      const paymentIds = Array.isArray(ids) ? ids : [ids];
      await Promise.all(
        paymentIds.map((paymentId) =>
          debtsClient.deletePayment(debtId, paymentId),
        ),
      );

      return paymentIds.length;
    },
    onSuccessMessage: t("_pages:debts.actions.deletePayment.successMessage"),
    onSuccess: () => {
      void queryClient.invalidateQueries({ ...AccountsQueryKeys.all() });
    },
    ...DebtsQueryKeys.all(),
  });

  return {
    ...deleteDialog,
    title: t("_pages:debts.actions.deletePayment.confirmTitle"),
  };
}
