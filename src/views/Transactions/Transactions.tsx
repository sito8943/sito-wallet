import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// components
import { ConfirmationDialog, Page, TabsLayout, TabsType } from "components";

// hooks
import { useAddTransaction, useEditTransaction } from "./hooks";
import {
  TransactionsQueryKeys,
  useAccountsCommon,
  useDeleteDialog,
  useRestoreDialog,
} from "hooks";

// components
import {
  AddTransactionDialog,
  EditTransactionDialog,
  TransactionGrid,
  TransactionTable,
} from "./components";

// lib
import { TransactionDto } from "lib";

// providers
import { useManager } from "providers";

export function Transactions() {
  const { t } = useTranslation();

  const manager = useManager();

  const [showFilters, setShowFilters] = useState(false);

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

  const getTableActions = useCallback(
    (record: TransactionDto) => [
      editTransaction.action(record),
      deleteTransaction.action(record),
      restoreTransaction.action(record),
    ],
    [deleteTransaction, editTransaction, restoreTransaction]
  );

  const getGridActions = useCallback(
    (record: TransactionDto) => [
      deleteTransaction.action(record),
      restoreTransaction.action(record),
    ],
    [deleteTransaction, restoreTransaction]
  );

  // #region accounts

  const account = useAccountsCommon();

  const accountDesktopTabs = useMemo(() => {
    return (account.data?.map((item) => ({
      id: item.id,
      label: item.name,
      content: (
        <TransactionTable
          accounts={account.data}
          accountId={item.id}
          getActions={getTableActions}
          editAction={editTransaction}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      ),
    })) ?? []) as TabsType[];
  }, [account.data, editTransaction, getTableActions, showFilters]);

  const accountMobileTabs = useMemo(() => {
    return (account.data?.map((item) => ({
      id: item.id,
      label: item.name,
      content: (
        <TransactionGrid
          accounts={account.data}
          accountId={item.id}
          getActions={getGridActions}
          editAction={editTransaction}
        />
      ),
    })) ?? []) as TabsType[];
  }, [account.data, editTransaction, getGridActions]);

  // #endregion accounts

  return (
    <Page
      title={t("_pages:transactions.title")}
      isLoading={account.isLoading}
      addOptions={{
        onClick: () => addTransaction.onClick(),
        disabled: account.isLoading,
        tooltip: t("_pages:transactions.add"),
      }}
      filterOptions={{
        onClick: () => setShowFilters(!showFilters),
        disabled: account.isLoading,
        tooltip: t("_accessibility:buttons.filters"),
      }}
      queryKey={TransactionsQueryKeys.all().queryKey}
    >
      <TabsLayout tabs={accountDesktopTabs} className="h-full max-xs:hidden" />
      <TabsLayout tabs={accountMobileTabs} className="h-full min-xs:hidden" />

      {/* Dialogs */}
      <EditTransactionDialog {...editTransaction} />
      <AddTransactionDialog {...addTransaction} />
      <ConfirmationDialog {...deleteTransaction} />
      <ConfirmationDialog {...restoreTransaction} />
    </Page>
  );
}
