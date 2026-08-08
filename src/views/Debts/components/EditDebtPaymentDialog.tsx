import { FormDialog } from "@sito/dashboard-app";

import type { EditDebtPaymentDialogPropsType } from "../types";

import { DebtPaymentForm } from "./DebtPaymentForm";

export function EditDebtPaymentDialog(
  props: EditDebtPaymentDialogPropsType,
) {
  return (
    <FormDialog {...props}>
      <DebtPaymentForm {...props} />
    </FormDialog>
  );
}
