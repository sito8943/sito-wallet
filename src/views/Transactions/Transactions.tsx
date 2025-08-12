import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { parseQueries } from "some-javascript-utils/browser";

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
import { FilterTransactionDto, TransactionDto } from "lib";

// providers
import { useManager } from "providers";

// styles
import "./styles.css";

export function Transactions() {
  const { t } = useTranslation();

  const location = useLocation();

  const [tabValue, setTabValue] = useState<number>();
  const filteredCategory = useMemo(() => {
    const queries = parseQueries(location.search);

    if (queries.category && !isNaN(Number(queries.category))) {
      return Number(queries.category);
    }
    return undefined;
  }, [location]);

  const manager = useManager();

  const [showFilters, setShowFilters] = useState(false);

  // #region categories

  const categories = useTransactionCategoriesCommon();

  const parsedCategories = useMemo(
    () =>
      categories?.data?.map((category) => ({
        ...category,
        name:
          category.name === "init"
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
      content: (
        <TransactionTable
          accountId={item.id}
          categories={parsedCategories ?? []}
          getActions={getTableActions}
          editAction={editTransaction}
          showFilters={showFilters}
          categoryId={filteredCategory}
          setShowFilters={setShowFilters}
        />
      ),
    })) ?? []) as TabsType[];
  }, [
    accounts.data,
    editTransaction,
    filteredCategory,
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
          categoryId={filteredCategory}
        />
      ),
    })) ?? []) as TabsType[];
  }, [
    accounts.data,
    editTransaction,
    filteredCategory,
    getGridActions,
    parsedCategories,
  ]);

  useEffect(() => {
    console.log(parseQueries(location.search));
    const queries = parseQueries(location.search) as FilterTransactionDto;

    if (queries.accountId && !isNaN(queries.accountId)) {
      const accountId = Number(queries.accountId);
      if (accountDesktopTabs.find((tab) => tab.id === accountId))
        setTabValue(accountId);
    }
  }, [accountDesktopTabs, location]);

  return (
    <Page
      title={t("_pages:transactions.title")}
      isLoading={accounts.isLoading || categories.isLoading}
      addOptions={{
        onClick: () => addTransaction.onClick(),
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
