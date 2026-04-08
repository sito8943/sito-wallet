import loadable from "@loadable/component";
import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito-dashboard-app
import {
  Page,
  useDeleteDialog,
  useExportActionMutate,
  useRestoreDialog,
  ConfirmationDialog,
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
  useTransactionCategoriesCommon,
  useHideDeletedEntitiesPreference,
  useMobileNavbar,
  usePersistedTableOptions,
  useAccountsList,
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
import { AddAccountDialog } from "../Accounts";

// lib
import {
  FilterTransactionDto,
  Tables,
  TransactionDto,
  ImportPreviewTransactionDto,
  isFeatureDisabledBusinessError,
  CommonAccountDto,
  applyHideDeletedEntitiesPreference,
  normalizeListFilters,
  RouteQueryParam,
} from "lib";

// providers
import { useRegisterBottomNavAction, useManager } from "providers";

// styles
import "./styles.css";

// lazy
const WeeklySummarySection = loadable(
  () => import("./sections/WeeklySummarySection"),
);
const TransactionsDesktopSection = loadable(
  () => import("./sections/TransactionsDesktopSection"),
);
const TransactionsMobileSection = loadable(
  () => import("./sections/TransactionsMobileSection"),
);

const isMobile = window.innerWidth <= 640;

export function Transactions() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

  const location = useLocation();
  const navigate = useNavigate();

  const tabValue = useMemo(() => {
    const search = new URLSearchParams(location.search);
    const value = search.get(RouteQueryParam.accountId);
    if (!value) return undefined;

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [location.search]);

  const manager = useManager();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

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

  const {
    data: accounts,
    isLoading: isAccountLoading,
    error: accountError,
  } = useAccountsList({});

  useEffect(() => {
    if (
      !isFeatureDisabledBusinessError(accountError) &&
      !isFeatureDisabledBusinessError(categories.error)
    ) {
      return;
    }

    showErrorNotification({
      message: t("_pages:featureFlags.moduleUnavailable"),
    });
  }, [accountError, categories.error, showErrorNotification, t]);

  const selectedAccount = useMemo(() => {
    if (accounts) {
      return tabValue
        ? (accounts.items.find((account) => account.id === Number(tabValue)) ??
            null)
        : (accounts.items[0] ?? null);
    }
  }, [accounts, tabValue]);

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
    account: selectedAccount as CommonAccountDto,
  });

  const editTransaction = useEditTransaction();

  const assignTransactionAccount = useAssignTransactionAccountAction();
  const assignTransactionCategory = useAssignTransactionCategoryAction();

  const { filters } = useTableOptions();

  const exportTransactions = useExportActionMutate({
    entity: Tables.Transactions,
    mutationFn: () =>
      manager.Transactions.export(
        applyHideDeletedEntitiesPreference(
          normalizeListFilters({
            ...filters,
            accountId: selectedAccount?.id,
          }) as Record<string, unknown>,
          hideDeletedEntities,
        ) as FilterTransactionDto,
      ),
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
    return (accounts?.items?.map((item) => ({
      id: item.id,
      label: item.name,
      to: `?accountId=${item.id}`,
      content: (
        <TransactionTable
          accountId={item.id}
          categories={parsedCategories ?? []}
          getActions={getTableActions}
          editAction={editTransaction}
          hideDeletedEntities={hideDeletedEntities}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      ),
    })) ?? []) as TabsType[];
  }, [
    accounts?.items,
    editTransaction,
    getTableActions,
    hideDeletedEntities,
    parsedCategories,
    showFilters,
  ]);

  const accountMobileTabs = useMemo(() => {
    return (accounts?.items?.map((item) => ({
      id: item.id,
      label: item.name,
      content: (
        <TransactionGrid
          accountId={item.id}
          categories={parsedCategories ?? []}
          getActions={getGridActions}
          editAction={editTransaction}
          hideDeletedEntities={hideDeletedEntities}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      ),
    })) ?? []) as TabsType[];
  }, [
    accounts?.items,
    editTransaction,
    getGridActions,
    hideDeletedEntities,
    parsedCategories,
    showFilters,
    setShowFilters,
  ]);

  const pageToolbar = useMemo(() => {
    return [exportTransactions.action(), importTransactions.action()];
  }, [exportTransactions, importTransactions]);

  useMobileNavbar(t("_pages:transactions.title"), pageToolbar);

  const openAddTransactionRef = useRef(addTransaction.openDialog);
  useEffect(() => {
    openAddTransactionRef.current = addTransaction.openDialog;
  }, [addTransaction.openDialog]);
  useRegisterBottomNavAction(
    useCallback(() => openAddTransactionRef.current(), []),
  );

  const noAccounts = useMemo(() => {
    return accountDesktopTabs.length === 0 || accountMobileTabs.length === 0;
  }, [accountDesktopTabs, accountMobileTabs]);

  const handleAccountChange = useCallback(
    (accountId: number) => {
      if (!accountId) return;

      const nextSearch = new URLSearchParams(location.search);
      nextSearch.set(RouteQueryParam.accountId, String(accountId));

      navigate(
        {
          pathname: location.pathname,
          search: `?${nextSearch.toString()}`,
        },
        { replace: true },
      );
    },
    [location.pathname, location.search, navigate],
  );

  return (
    <Page
      title={t("_pages:transactions.title")}
      isLoading={isAccountLoading || categories.isLoading}
      actions={pageToolbar}
      addOptions={{
        onClick: () => addTransaction.openDialog(),
        disabled: isAccountLoading,
        tooltip: t("_pages:transactions.add"),
      }}
      filterOptions={{
        onClick: () => {
          if (!showFilters) setTimeout(() => setShowFilters(true), 0);
          else setShowFilters(false);
        },
        disabled: isAccountLoading,
        tooltip: t("_accessibility:buttons.filters"),
      }}
      queryKey={TransactionsQueryKeys.all().queryKey}
    >
      <WeeklySummarySection selectedAccount={selectedAccount} />

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
            disabled: isAccountLoading,
            onClick: () => addAccount.openDialog(),
            tooltip: t("_pages:accounts.add"),
          }}
        />
      ) : (
        <>
          {isMobile ? (
            <TransactionsMobileSection
              accounts={accounts?.items ?? []}
              selectedAccount={selectedAccount}
              isAccountLoading={isAccountLoading}
              accountError={accountError}
              onAccountChange={handleAccountChange}
              onOpenFilters={() => setShowFilters(true)}
              tabValue={tabValue}
              tabs={accountMobileTabs}
            />
          ) : (
            <TransactionsDesktopSection
              tabValue={tabValue}
              tabs={accountDesktopTabs}
            />
          )}
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
