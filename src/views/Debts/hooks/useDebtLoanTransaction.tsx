import { useCallback, useEffect, useRef, useState } from "react";
import type { DefaultValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useDialog } from "@sito/dashboard-app";

import { useFeatureFlags } from "providers";

import { useAddTransaction } from "../../Transactions/hooks";
import type { TransactionFormType } from "../../Transactions/types";
import type { DebtFormType } from "../types";
import { debtFormToLoanTransactionValues, isOutgoingLoan } from "../utils";
import type { UseDebtLoanTransactionResult } from "./types";

/**
 * After an outgoing loan is created, asks whether to record the transaction
 * and opens the add-transaction dialog prefilled so the user picks the
 * account and category. `onDone` runs once the flow ends either way.
 */
export function useDebtLoanTransaction(
  onDone: () => void,
): UseDebtLoanTransactionResult {
  const { t } = useTranslation();
  const { isFeatureEnabled } = useFeatureFlags();
  const confirm = useDialog();
  const addTransaction = useAddTransaction({ account: null });

  const [values, setValues] =
    useState<DefaultValues<TransactionFormType> | null>(null);
  const transactionOpened = useRef(false);

  useEffect(() => {
    if (addTransaction.open) {
      transactionOpened.current = true;
      return;
    }
    if (!transactionOpened.current) return;

    transactionOpened.current = false;
    onDone();
  }, [addTransaction.open, onDone]);

  const offer = useCallback(
    (form: DebtFormType) => {
      if (!isFeatureEnabled("transactionsEnabled") || !isOutgoingLoan(form)) {
        return false;
      }

      setValues(
        debtFormToLoanTransactionValues(
          form,
          t("_pages:debts.loanTransaction.description", {
            counterparty: form.counterpartyName.trim(),
            title: form.title.trim(),
          }),
        ),
      );
      confirm.handleOpen();
      return true;
    },
    [confirm, isFeatureEnabled, t],
  );

  const { openDialog } = addTransaction;

  return {
    offer,
    addTransaction,
    confirmDialog: {
      open: confirm.open,
      title: t("_pages:debts.loanTransaction.title"),
      children: <p>{t("_pages:debts.loanTransaction.body")}</p>,
      handleClose: () => {
        confirm.handleClose();
        onDone();
      },
      handleSubmit: () => {
        confirm.handleClose();
        openDialog(values ? { values } : undefined);
      },
    },
  };
}
