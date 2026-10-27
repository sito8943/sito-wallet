import { useCallback } from "react";

// hooks
import { useAddTransaction } from "./useAddTransaction";
import { useReceiptScan } from "./useReceiptScan";

// utils
import { addEmptyTransaction } from "../utils";

// types
import type { UseQuickAddTransactionPropsType } from "../types";

/**
 * "New transaction" dialog plus receipt scan wired into it: a scanned receipt
 * opens the dialog already filled in. Shared by Transactions and Home.
 */
export function useQuickAddTransaction(props: UseQuickAddTransactionPropsType) {
  const { account } = props;

  const addTransaction = useAddTransaction({ account });
  const { openDialog } = addTransaction;

  const receiptScan = useReceiptScan({
    onDraft: useCallback(
      (values) =>
        openDialog({
          values: { ...addEmptyTransaction(account), ...values },
        }),
      [account, openDialog],
    ),
  });

  return { addTransaction, receiptScan };
}
