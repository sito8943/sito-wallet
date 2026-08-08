import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useNotification, usePutDialog } from "@sito/dashboard-app";

import { AccountsQueryKeys, DebtsQueryKeys } from "hooks";
import { useManager } from "providers";

import type { DebtDto, DebtPaymentDto, UpdateDebtPaymentDto } from "lib";
import { parseErrorMessage } from "lib";

import type { DebtPaymentFormType } from "../types";
import {
  debtPaymentDtoToForm,
  debtPaymentFormToUpdateDto,
  emptyDebtPaymentForm,
} from "../utils";

export function useEditDebtPaymentDialog(selectedDebt: DebtDto | null) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { showErrorNotification } = useNotification();
  const manager = useManager();
  const debtsClient = "Debts" in manager ? manager.Debts : null;

  const formDialog = usePutDialog<
    DebtPaymentDto,
    UpdateDebtPaymentDto,
    DebtPaymentDto,
    DebtPaymentFormType
  >({
    defaultValues: emptyDebtPaymentForm,
    dtoToForm: debtPaymentDtoToForm,
    formToDto: debtPaymentFormToUpdateDto,
    getFunction: async (paymentId) => {
      if (!debtsClient || !selectedDebt) {
        throw new Error("Debt payment not found");
      }

      return await debtsClient.getPaymentById(selectedDebt.id, paymentId);
    },
    mutationFn: async (data) => {
      if (!debtsClient) {
        throw new Error("debts.featureDisabled");
      }

      return await debtsClient.updatePayment(data);
    },
    onSuccessMessage: t("_pages:debts.actions.editPayment.successMessage"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ ...AccountsQueryKeys.all() });
    },
    onError: (error) => {
      showErrorNotification({
        message: parseErrorMessage(error, t("_accessibility:errors.500")),
      });
    },
    title: t("_pages:debts.actions.editPayment.title"),
    ...DebtsQueryKeys.all(),
  });

  return {
    ...formDialog,
    editingPayment: true,
    selectedDebt,
  };
}
