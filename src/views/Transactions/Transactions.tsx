import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  useTransactionCategoriesCommon,
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

// styles
import "./styles.css";

export function Transactions() {
  const { t } = useTranslation();

  const location = useLocation();

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

  // #region categories

  const categories = useTransactionCategoriesCommon();

  // #endregion categories

  // #region accounts

  const account = useAccountsCommon();

  const accountDesktopTabs = useMemo(() => {
    return (account.data?.map((item) => ({
      id: item.id,
      label: item.name,
      content: (
        <TransactionTable
          accountId={item.id}
          categories={categories.data ?? []}
          getActions={getTableActions}
          editAction={editTransaction}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      ),
    })) ?? []) as TabsType[];
  }, [account.data, categories, editTransaction, getTableActions, showFilters]);

  const accountMobileTabs = useMemo(() => {
    return (account.data?.map((item) => ({
      id: item.id,
      label: item.name,
      content: (
        <TransactionGrid
          accountId={item.id}
          categories={categories.data ?? []}
          getActions={getGridActions}
          editAction={editTransaction}
        />
      ),
    })) ?? []) as TabsType[];
  }, [account.data, categories.data, editTransaction, getGridActions]);

  // #endregion accounts

  const [tabValue, setTabValue] = useState<number>();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.split("#")[1];
      if (accountDesktopTabs.find((tab) => tab.id === Number(id)))
        setTabValue(Number(id));
    }
  }, [accountDesktopTabs, location]);

  return (
    <Page
      title={t("_pages:transactions.title")}
      isLoading={account.isLoading || categories.isLoading}
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
      <TabsLayout
        defaultTab={tabValue}
        tabs={accountDesktopTabs}
        className="h-full max-xs:hidden"
        tabsContainerClassName="account-tabs"
      />
      <TabsLayout
        defaultTab={tabValue}
        tabs={accountMobileTabs}
        className="h-full min-xs:hidden"
        tabsContainerClassName="account-tabs"
      />

      {/* Dialogs */}
      <EditTransactionDialog {...editTransaction} />
      <AddTransactionDialog {...addTransaction} />
      <ConfirmationDialog {...deleteTransaction} />
      <ConfirmationDialog {...restoreTransaction} />

      {/* Category Dialogs */}
      {/* <EditTransactionDialog /> */}

    </Page>
  );
}
