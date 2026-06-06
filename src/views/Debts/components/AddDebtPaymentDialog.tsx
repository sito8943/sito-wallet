import { FormDialog } from "@sito/dashboard-app";

import type { AddDebtPaymentDialogPropsType } from "../types";

import { DebtPaymentForm } from "./DebtPaymentForm";

export function AddDebtPaymentDialog(props: AddDebtPaymentDialogPropsType) {
  return (
    <FormDialog {...props}>
      <DebtPaymentForm {...props} />
    </FormDialog>
  );
}
