// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import type { AddTransactionDialogPropsType } from "../types";

// components
import { ReceiptScanButton } from "./ReceiptScanButton";
import { TransactionForm } from "./TransactionForm";

export function AddTransactionDialog(props: AddTransactionDialogPropsType) {
  return (
    <FormDialog mobileFullScreen {...props}>
      <ReceiptScanButton
        setValue={props.setValue}
        getValues={props.getValues}
        disabled={props.isLoading}
      />
      <TransactionForm {...props} />
    </FormDialog>
  );
}
