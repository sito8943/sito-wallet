// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import { EditTransactionDialogPropsType } from "../types";

// components
import { TransactionForm } from "./TransactionForm";

export function EditTransactionDialog(props: EditTransactionDialogPropsType) {
  return (
    <FormDialog {...props}>
      <TransactionForm {...props} />
    </FormDialog>
  );
}
