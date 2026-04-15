// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import { AddTransactionDialogPropsType } from "../types";

// components
import { TransactionForm } from "./TransactionForm";

export function AddTransactionDialog(props: AddTransactionDialogPropsType) {
  return (
    <FormDialog {...props}>
      <TransactionForm {...props} />
    </FormDialog>
  );
}
