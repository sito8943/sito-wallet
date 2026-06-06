import { useCallback } from "react";

import { useDeleteDialog } from "@sito/dashboard-app";

import { DebtsQueryKeys } from "hooks";
import { useManager } from "providers";

import type { DebtDto } from "lib";

import { useCancelDebtAction } from "./useCancelDebtAction";

export function useCancelDebtDialog() {
  const manager = useManager();
  const debtsClient = "Debts" in manager ? manager.Debts : null;

  const cancelDialog = useDeleteDialog({
    mutationFn: async (ids) => {
      if (!debtsClient) throw new Error("debts.featureDisabled");

      const targetIds = Array.isArray(ids) ? ids : [ids];
      await Promise.all(targetIds.map((id) => debtsClient.cancel(id)));

      return targetIds.length;
    },
    ...DebtsQueryKeys.all(),
  });

  const { action } = useCancelDebtAction({
    onClick: useCallback(
      (record: DebtDto) => {
        void cancelDialog.onClick(record.id);
      },
      [cancelDialog],
    ),
  });

  return {
    ...cancelDialog,
    action,
  };
}
