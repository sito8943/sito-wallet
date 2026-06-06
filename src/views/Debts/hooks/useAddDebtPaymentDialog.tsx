import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

import { useNotification, usePostDialog } from "@sito/dashboard-app";

import { DebtsQueryKeys } from "hooks";
import { useManager } from "providers";

import type { AddDebtPaymentDto, DebtDto, DebtPaymentDto } from "lib";

import { emptyDebtPaymentForm, debtPaymentFormToDto } from "../utils";
import type { DebtPaymentFormType } from "../types";
import { useAddDebtPaymentAction } from "./useAddDebtPaymentAction";

export function useAddDebtPaymentDialog() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { showErrorNotification } = useNotification();

  const manager = useManager();
  const debtsClient = "Debts" in manager ? manager.Debts : null;

  const [selectedDebt, setSelectedDebt] = useState<DebtDto | null>(null);
  const [resolvingDebtId, setResolvingDebtId] = useState<number | null>(null);

  const formDialog = usePostDialog<
    AddDebtPaymentDto,
    DebtPaymentDto,
    DebtPaymentFormType
  >({
    formToDto: debtPaymentFormToDto,
    defaultValues: emptyDebtPaymentForm,
    mutationFn: async (data) => {
      if (!debtsClient || !selectedDebt) {
        throw new Error("Debt not found with id: 0");
      }

      return await debtsClient.createPayment(selectedDebt.id, data);
    },
    onSuccessMessage: t("_pages:debts.actions.payment.successMessage"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        ...DebtsQueryKeys.all(),
      });
      setSelectedDebt(null);
    },
    title: t("_pages:debts.actions.payment.title"),
    ...DebtsQueryKeys.all(),
  });

  const openDialogForDebt = useCallback(
    (record: DebtDto) => {
      setSelectedDebt(record);
      formDialog.openDialog();
    },
    [formDialog],
  );

  const openDialogByDebtId = useCallback(
    async (debtId: number) => {
      if (!debtsClient) {
        showErrorNotification({
          message: t("_pages:featureFlags.moduleUnavailable"),
        });
        return;
      }

      setResolvingDebtId(debtId);

      try {
        const debt = await debtsClient.getById(debtId);
        openDialogForDebt(debt);
      } catch (error) {
        showErrorNotification({
          message:
            error instanceof Error
              ? error.message
              : t("_accessibility:errors.500"),
        });
      } finally {
        setResolvingDebtId(null);
      }
    },
    [openDialogForDebt, showErrorNotification, debtsClient, t],
  );

  const handleClose = useCallback(() => {
    setSelectedDebt(null);
    formDialog.handleClose();
  }, [formDialog]);

  const { action } = useAddDebtPaymentAction({
    onClick: openDialogForDebt,
  });

  return {
    ...formDialog,
    action,
    handleClose,
    openDialogByDebtId,
    openDialogForDebt,
    resolvingDebtId,
    selectedDebt,
  };
}
