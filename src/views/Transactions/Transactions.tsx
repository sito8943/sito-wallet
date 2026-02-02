import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { parseQueries } from "some-javascript-utils/browser";

// @sito-dashboard-app
import {
  Page,
  useDeleteDialog,
  useExportActionMutate,
  useRestoreDialog,
  ConfirmationDialog,
  TabsLayout,
  TabsType,
  useTableOptions,
  Empty,
  GlobalActions,
  useImportDialog,
  ImportDialog,
} from "@sito/dashboard-app";

// icons
import { faAdd, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// hooks
import { useAddTransaction, useEditTransaction } from "./hooks";
import { useAddAccountDialog } from "../Accounts/hooks";
import {
  TransactionsQueryKeys,
  useAccountsCommon,
  useTransactionCategoriesCommon,
} from "hooks";

// components
import {
  AddTransactionDialog,
  EditTransactionDialog,
  TransactionGrid,
  TransactionTable,
} from "./components";
import { WeeklyCard } from "./components/WeeklyCard";
import { AddAccountDialog } from "../Accounts";

// lib
import {
  FilterTransactionDto,
  Tables,
  TransactionDto,
  TransactionType,
} from "lib";

// providers
import { useManager } from "providers";

// styles
import "./styles.css";

export function Transactions() {
  const { t } = useTranslation();

  const location = useLocation();

  const [tabValue, setTabValue] = useState<number>();

  const manager = useManager();

  const [showFilters, setShowFilters] = useState(false);

  // #region categories

  const categories = useTransactionCategoriesCommon();

  const parsedCategories = useMemo(
    () =>
      categories?.data?.map((category) => ({
        ...category,
        name: category.initial
          ? t("_entities:transactionCategory.name.init")
          : category.name,
      })),
    [categories?.data, t]
  );

  // #endregion categories

  // #region accounts

  const accounts = useAccountsCommon();

  const selectedAccount = useMemo(
    () =>
      tabValue
        ? accounts.data?.find((account) => account.id === Number(tabValue)) ??
          null
        : accounts.data?.[0] ?? null,
    [accounts.data, tabValue]
  );

  const addAccount = useAddAccountDialog();

  // #endregion accounts

  // #region actions

  const deleteTransaction = useDeleteDialog({
    mutationFn: (data) => manager.Transactions.softDelete(data),
    ...TransactionsQueryKeys.all(),
  });

  const restoreTransaction = useRestoreDialog({
    mutationFn: (data) => manager.Transactions.restore(data),
    ...TransactionsQueryKeys.all(),
  });

  const addTransaction = useAddTransaction({
    account: selectedAccount,
  });

  const editTransaction = useEditTransaction();

  const { filters } = useTableOptions();

  const exportTransactions = useExportActionMutate({
    entity: Tables.Transactions,
    mutationFn: () => manager.Transactions.export(filters),
  });

  const importTransactions = useImportDialog({
    entity: Tables.Transactions,
    mutationFn: (data) => manager.Transactions.import(data),
    ...TransactionsQueryKeys.all(),
  });

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

  const accountDesktopTabs = useMemo(() => {
    return (accounts.data?.map((item) => ({
      id: item.id,
      label: item.name,
      to: `?accountId=${item.id}`,
      content: (
        <TransactionTable
          accountId={item.id}
          categories={parsedCategories ?? []}
          getActions={getTableActions}
          editAction={editTransaction}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      ),
    })) ?? []) as TabsType[];
  }, [
    accounts.data,
    editTransaction,
    getTableActions,
    parsedCategories,
    showFilters,
  ]);

  const accountMobileTabs = useMemo(() => {
    return (accounts.data?.map((item) => ({
      id: item.id,
      label: item.name,
      content: (
        <TransactionGrid
          accountId={item.id}
          categories={parsedCategories ?? []}
          getActions={getGridActions}
          editAction={editTransaction}
        />
      ),
    })) ?? []) as TabsType[];
  }, [accounts.data, editTransaction, getGridActions, parsedCategories]);

  useEffect(() => {
    const queries = parseQueries(location.search) as FilterTransactionDto;

    if (queries.accountId && !isNaN(queries.accountId)) {
      const accountId = Number(queries.accountId);
      if (accountDesktopTabs.find((tab) => tab.id === accountId))
        setTabValue(accountId);
    }
  }, [accountDesktopTabs, location]);

  const pageToolbar = useMemo(() => {
    return [exportTransactions.action(), importTransactions.action()];
  }, [exportTransactions, importTransactions]);

  const noAccounts = useMemo(() => {
    return accountDesktopTabs.length === 0 || accountMobileTabs.length === 0;
  }, [accountDesktopTabs, accountMobileTabs]);

  const [open, setOpen] = useState(false);

  return (
    <Page
      title={t("_pages:transactions.title")}
      isLoading={accounts.isLoading || categories.isLoading}
      actions={pageToolbar}
      addOptions={{
        onClick: () => addTransaction.openDialog(),
        disabled: accounts.isLoading,
        tooltip: t("_pages:transactions.add"),
      }}
      filterOptions={{
        onClick: () => setShowFilters(!showFilters),
        disabled: accounts.isLoading,
        tooltip: t("_accessibility:buttons.filters"),
      }}
      queryKey={TransactionsQueryKeys.all().queryKey}
    >
      {/* Weekly summary cards */}
      <div className="mb-4 grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <WeeklyCard
          type={TransactionType.Out}
          title={t("_pages:transactions.cards.weeklySpent.title")}
          accountId={selectedAccount?.id}
          currencyName={selectedAccount?.currency?.name}
          currencySymbol={selectedAccount?.currency?.symbol}
        />
        <WeeklyCard
          type={TransactionType.In}
          title={t("_pages:transactions.cards.weeklyIncoming.title")}
          accountId={selectedAccount?.id}
          currencyName={selectedAccount?.currency?.name}
          currencySymbol={selectedAccount?.currency?.symbol}
        />
      </div>

      {noAccounts ? (
        <Empty
          message={t("_pages:accounts.empty")}
          iconProps={{
            icon: faWallet,
            className: "text-5xl max-md:text-3xl text-gray-400",
          }}
          action={{
            icon: <FontAwesomeIcon icon={faAdd} />,
            id: GlobalActions.Add,
            disabled: accounts.isLoading,
            onClick: () => addAccount.openDialog(),
            tooltip: t("_pages:accounts.add"),
          }}
        />
      ) : (
        <>
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
        </>
      )}

      {/* Dialogs */}
      <AddAccountDialog {...addAccount} />
      <EditTransactionDialog {...editTransaction} />
      <AddTransactionDialog {...addTransaction} />
      <ConfirmationDialog {...deleteTransaction} />
      <ConfirmationDialog {...restoreTransaction} />
      <ImportDialog {...importTransactions}>
        <p className="mt-2">Choose a file and confirm.</p>
      </ImportDialog>

      {/* Category Dialogs */}
      {/* <EditTransactionDialog /> */}
    </Page>
  );
}
