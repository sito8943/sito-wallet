import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// providers
import { useManager } from "providers";

// components
import { ConfirmationDialog, Error, Page, PrettyGrid } from "components";
import {
  AddTransactionDialog,
  TransactionCard,
  EditTransactionDialog,
} from "./components";

// hooks
import {
  useDeleteDialog,
  useTransactionsList,
  TransactionsQueryKeys,
  useRestoreDialog,
} from "hooks";
import { useAddTransaction, useEditTransaction } from "./hooks";

// types
import { TransactionDto } from "lib";

export function Transactions() {
  const { t } = useTranslation();

  const manager = useManager();

  const { data, isLoading, error } = useTransactionsList({});

  // #region actions

  const deleteTransaction = useDeleteDialog({
    mutationFn: (data) => manager.Transactions.softDelete(data),
    ...TransactionsQueryKeys.all(),
  });

  const restoreTransaction = useRestoreDialog({
    mutationFn: (data) => manager.Transactions.restore(data),
    ...TransactionsQueryKeys.all(),
  });

  const addTransaction = useAddTransaction();

  const editTransaction = useEditTransaction();

  // #endregion

  const getActions = useCallback(
    (record: TransactionDto) => [
      deleteTransaction.action(record),
      restoreTransaction.action(record),
    ],
    [deleteTransaction, restoreTransaction]
  );

  return (
    <Page
      title={t("_pages:transactions.title")}
      isLoading={isLoading}
      addOptions={{
        onClick: () => addTransaction.onClick(),
        disabled: isLoading,
        tooltip: t("_pages:transactions.add"),
      }}
      queryKey={TransactionsQueryKeys.all().queryKey}
    >
      {!error ? (
        <>
          <PrettyGrid
            data={data?.items}
            emptyMessage={t("_pages:transactions.empty")}
            renderComponent={(transaction) => (
              <TransactionCard
                actions={getActions(transaction)}
                onClick={(id: number) => editTransaction.onClick(id)}
                {...transaction}
              />
            )}
          />
          {/* Dialogs */}
          <AddTransactionDialog {...addTransaction} />
          <EditTransactionDialog {...editTransaction} />
          <ConfirmationDialog {...deleteTransaction} />
          <ConfirmationDialog {...restoreTransaction} />
        </>
      ) : (
        <Error message={error?.message} />
      )}
    </Page>
  );
}
