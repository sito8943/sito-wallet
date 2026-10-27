import { useCallback } from "react";

// components
import { BottomNavAction } from "components";
import {
  AddTransactionDialog,
  ReceiptScanFab,
  useQuickAddTransaction,
} from "views/Transactions";

/**
 * Home's quick entry: the bottom-nav "Add" opens a new transaction and the
 * receipt FAB scans a ticket into one (same flow as the Transactions view).
 * No account is preselected: Home has no account context, the form asks.
 */
export function QuickTransaction() {
  const { addTransaction, receiptScan } = useQuickAddTransaction({
    account: null,
  });
  const { openDialog } = addTransaction;

  return (
    <>
      <BottomNavAction action={useCallback(() => openDialog(), [openDialog])} />
      <AddTransactionDialog {...addTransaction} />
      <ReceiptScanFab
        onScan={receiptScan.scan}
        isScanning={receiptScan.isScanning}
      />
    </>
  );
}
