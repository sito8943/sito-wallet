// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import type { EditTransactionDialogPropsType } from "../types";

// components
import { TransactionForm } from "./TransactionForm";

export function EditTransactionDialog(props: EditTransactionDialogPropsType) {
  return (
    <FormDialog mobileFullScreen {...props}>
      <TransactionForm {...props} />
    </FormDialog>
  );
}
