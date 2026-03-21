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
  ImportDialog,
  useImportDialog,
  useNotification,
} from "@sito/dashboard-app";

// icons
import { faAdd, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// hooks
import {
  useAddTransaction,
  useEditTransaction,
  useAssignTransactionAccountAction,
  useAssignTransactionCategoryAction,
} from "./hooks";
import { useAddAccountDialog } from "../Accounts/hooks";
import {
  TransactionsQueryKeys,
  useAccountsCommon,
  useTransactionCategoriesCommon,
  useMobileNavbar,
  usePersistedTableOptions,
} from "hooks";

// components
import {
  AddTransactionDialog,
  AssignAccountDialog,
  AssignCategoryDialog,
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
  ImportPreviewTransactionDto,
  isFeatureDisabledBusinessError,
} from "lib";

// providers
import { useManager } from "providers";

// styles
import "./styles.css";
import AccountCarousel from "./components/AccountCaruosel";

export function Transactions() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

  const location = useLocation();

  const tabValue = useMemo(() => {
    const queries = parseQueries(location.search) as FilterTransactionDto;
    return queries.accountId && !isNaN(queries.accountId)
      ? Number(queries.accountId)
      : undefined;
  }, [location.search]);

  const manager = useManager();

  const [showFilters, setShowFilters] = useState(false);

  // #region categories

  const categories = useTransactionCategoriesCommon();

  const parsedCategories = categories.data?.map((category) => ({
    ...category,
    name: category.auto
      ? t("_entities:transactionCategory.name.init")
      : category.name,
  }));

  // #endregion categories

  // #region accounts

  const accounts = useAccountsCommon();

  useEffect(() => {
    if (
      !isFeatureDisabledBusinessError(accounts.error) &&
      !isFeatureDisabledBusinessError(categories.error)
    ) {
      return;
    }

    showErrorNotification({
      message: t("_pages:featureFlags.moduleUnavailable"),
    });
  }, [accounts.error, categories.error, showErrorNotification, t]);

  const selectedAccount = useMemo(
    () =>
      tabValue
        ? (accounts.data?.find((account) => account.id === Number(tabValue)) ??
          null)
        : (accounts.data?.[0] ?? null),
    [accounts.data, tabValue],
  );

  usePersistedTableOptions("transactions", selectedAccount?.id);

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

  const assignTransactionAccount = useAssignTransactionAccountAction();
  const assignTransactionCategory = useAssignTransactionCategoryAction();

  const { filters } = useTableOptions();

  const exportTransactions = useExportActionMutate({
    entity: Tables.Transactions,
    mutationFn: () =>
      manager.Transactions.export({
        ...filters,
        accountId: selectedAccount?.id,
      }),
  });

  const handleTransactionProcess = useCallback(
    (file: File, options?: { override?: boolean }) =>
      manager.Transactions.processImport(file, options?.override),
    [manager],
  );

  const importTransactions = useImportDialog<
    TransactionDto,
    ImportPreviewTransactionDto
  >({
    entity: Tables.Transactions,
    fileProcessor: handleTransactionProcess,
    mutationFn: (data) => manager.Transactions.import(data),
    ...TransactionsQueryKeys.all(),
  });

  // #endregion

  const getTableActions = useCallback(
    (record: TransactionDto) => [
      assignTransactionCategory.action(record),
      assignTransactionAccount.action(record),
      editTransaction.action(record),
      deleteTransaction.action(record),
      restoreTransaction.action(record),
    ],
    [
      assignTransactionCategory,
      assignTransactionAccount,
      deleteTransaction,
      editTransaction,
      restoreTransaction,
    ],
  );

  const getGridActions = useCallback(
    (record: TransactionDto) => [
      assignTransactionCategory.action(record),
      assignTransactionAccount.action(record),
      deleteTransaction.action(record),
      restoreTransaction.action(record),
    ],
    [
      assignTransactionAccount,
      assignTransactionCategory,
      deleteTransaction,
      restoreTransaction,
    ],
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

  const pageToolbar = useMemo(() => {
    return [exportTransactions.action(), importTransactions.action()];
  }, [exportTransactions, importTransactions]);

  useMobileNavbar(t("_pages:transactions.title"), pageToolbar);

  const noAccounts = useMemo(() => {
    return accountDesktopTabs.length === 0 || accountMobileTabs.length === 0;
  }, [accountDesktopTabs, accountMobileTabs]);

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
        onClick: () => {
          if (!showFilters) setTimeout(() => setShowFilters(true), 0);
          else setShowFilters(false);
        },
        disabled: accounts.isLoading,
        tooltip: t("_accessibility:buttons.filters"),
      }}
      queryKey={TransactionsQueryKeys.all().queryKey}
    >
      {selectedAccount && (
        <div className="mb-4 grid grid-cols-2 gap-4 max-md:grid-cols-1 max-sm:hidden">
          <WeeklyCard
            type={TransactionType.Out}
            title={t("_pages:transactions.cards.weeklySpent.title")}
            accountId={selectedAccount.id}
            currencyName={selectedAccount.currency?.name}
            currencySymbol={selectedAccount.currency?.symbol}
          />
          <WeeklyCard
            type={TransactionType.In}
            title={t("_pages:transactions.cards.weeklyIncoming.title")}
            accountId={selectedAccount.id}
            currencyName={selectedAccount.currency?.name}
            currencySymbol={selectedAccount.currency?.symbol}
          />
        </div>
      )}

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
            className="max-sm:hidden"
            tabsContainerClassName="account-tabs"
          />
          <AccountCarousel className="sm:hidden mb-4" />
          <TabsLayout
            defaultTab={tabValue}
            tabs={accountMobileTabs}
            className="min-sm:hidden"
            tabsContainerClassName="mobile-account-tabs"
          />
        </>
      )}

      {/* Dialogs */}
      <AddAccountDialog {...addAccount} />
      <EditTransactionDialog {...editTransaction} />
      <AddTransactionDialog {...addTransaction} />
      <ConfirmationDialog {...deleteTransaction} />
      <ConfirmationDialog {...restoreTransaction} />
      <ImportDialog {...importTransactions} />
      <AssignAccountDialog {...assignTransactionAccount} />
      <AssignCategoryDialog {...assignTransactionCategory} />
    </Page>
  );
}
