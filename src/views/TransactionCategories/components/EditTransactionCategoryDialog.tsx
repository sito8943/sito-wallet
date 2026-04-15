// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import { EditTransactionCategoryDialogPropsType } from "../types";

// components
import { TransactionCategoryForm } from "./TransactionCategoryForm";

export function EditTransactionCategoryDialog(
  props: EditTransactionCategoryDialogPropsType,
) {
  return (
    <FormDialog {...props}>
      <TransactionCategoryForm {...props} />
    </FormDialog>
  );
}
