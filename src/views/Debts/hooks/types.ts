import type { ConfirmationDialogPropsType } from "@sito/dashboard-app";

import type { DebtDto } from "lib";

import type { AddTransactionDialogPropsType } from "../../Transactions/types";
import type { DebtFormType } from "../types";

export interface UseDebtActionProps {
  onClick: (record: DebtDto) => void;
  hidden?: boolean;
}

export interface UseDebtLoanTransactionResult {
  /** Asks to record the outgoing transaction; returns false when not offered. */
  offer: (form: DebtFormType) => boolean;
  confirmDialog: ConfirmationDialogPropsType;
  addTransaction: AddTransactionDialogPropsType;
}
