// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import { AddTransactionCategoryDialogPropsType } from "../types";

// components
import { TransactionCategoryForm } from "./TransactionCategoryForm";

export function AddTransactionCategoryDialog(
  props: AddTransactionCategoryDialogPropsType,
) {
  return (
    <FormDialog {...props}>
      <TransactionCategoryForm {...props} />
    </FormDialog>
  );
}
