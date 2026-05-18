import loadable from "@loadable/component";
import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito-dashboard-app
import type {
  TabsType} from "@sito/dashboard-app";
import {
  Page,
  useDeleteDialog,
  useExportDialog,
  useRestoreDialog,
  ConfirmationDialog,
  useTableOptions,
  Empty,
  ExportDialog,
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
import { useEditTransactionCategoryDialog } from "../TransactionCategories/hooks";
import {
  TransactionsQueryKeys,
  useMobileNavbar,
  usePersistedTableOptions,
} from "hooks";
import { useAccountsList } from "../../hooks/queries/useAccountsList";
import { useHideDeletedEntitiesPreference } from "../../hooks/queries/useHideDeletedEntitiesPreference";
import { useTransactionCategoriesCommon } from "../../hooks/queries/useTransactionCategoriesCommon";

// components
import {
  AddTransactionDialog,
  AssignAccountDialog,
  AssignCategoryDialog,
  EditTransactionDialog,
  TransactionGrid,
  TransactionTable,
  WeeklyTransactionsDialog,
} from "./components";
import { AddAccountDialog } from "../Accounts";
import { EditTransactionCategoryDialog } from "../TransactionCategories/components";

// lib
import type {
  FilterTransactionDto,
  TransactionDto,
  ImportPreviewTransactionDto,
  CommonAccountDto} from "lib";
import {
  Tables,
  TransactionType,
  isFeatureDisabledBusinessError,
  applyHideDeletedEntitiesPreference,
  normalizeListFilters,
  RouteQueryParam,
  getTransactionsRouteWithAccountId,
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
  const { showErrorNotification, showSuccessNotification } = useNotification();

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
  const [weeklyTransactionsDialog, setWeeklyTransactionsDialog] = useState<{
    open: boolean;
    type: TransactionType;
    accountId?: number;
    title: string;
  }>({
    open: false,
    type: TransactionType.Out,
    accountId: undefined,
    title: "",
  });

  // #region categories

  const editTransactionCategory = useEditTransactionCategoryDialog();

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

  const exportTransactions = useExportDialog<
    TransactionDto,
    { includeCurrentAccount: boolean }
  >({
    entity: Tables.Transactions,
    defaultExtra: { includeCurrentAccount: true },
    mutationFn: ({ includeCurrentAccount }) => {
      const baseFilters = { ...filters };
      if (includeCurrentAccount) baseFilters.accountId = selectedAccount?.id;
      else delete baseFilters.accountId;

      return manager.Transactions.export(
        applyHideDeletedEntitiesPreference(
          normalizeListFilters(
            baseFilters as Record<string, unknown>,
          ),
          hideDeletedEntities,
        ) as FilterTransactionDto,
      );
    },
    onSuccess: (data) => {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${Tables.Transactions}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      showSuccessNotification({
        message: t("_pages:common.actions.export.successMessage"),
      });
    },
    renderExtraFields: ({ values, setValue }) => (
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={values.includeCurrentAccount}
          onChange={(e) =>
            setValue("includeCurrentAccount", e.target.checked)
          }
          className="accent-bg-primary"
        />
        <span className="text-text">
          {t("_pages:transactions.export.includeCurrentAccount")}
        </span>
      </label>
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
      to: getTransactionsRouteWithAccountId(item.id),
      content: (
        <TransactionTable
          accountId={item.id}
          categories={parsedCategories ?? []}
          getActions={getTableActions}
          editAction={editTransaction}
          hideDeletedEntities={hideDeletedEntities}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          onCategoryClick={editTransactionCategory.openDialog}
        />
      ),
    })) ?? []) as TabsType[];
  }, [
    accounts?.items,
    editTransaction,
    editTransactionCategory.openDialog,
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

  const handleOpenWeeklyTransactions = useCallback(
    (type: TransactionType) => {
      if (!selectedAccount?.id) return;

      setWeeklyTransactionsDialog({
        open: true,
        type,
        accountId: selectedAccount.id,
        title:
          type === TransactionType.Out
            ? t("_pages:transactions.cards.weeklySpent.title")
            : t("_pages:transactions.cards.weeklyIncoming.title"),
      });
    },
    [selectedAccount, t],
  );

  const handleCloseWeeklyTransactions = useCallback(() => {
    setWeeklyTransactionsDialog((previous) => ({
      ...previous,
      open: false,
    }));
  }, []);

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
      <WeeklySummarySection
        selectedAccount={selectedAccount}
        onOpenWeeklyTransactions={handleOpenWeeklyTransactions}
      />

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
      <ExportDialog
        {...exportTransactions}
        title={t("_pages:transactions.export.title")}
      />
      <AssignAccountDialog {...assignTransactionAccount} />
      <AssignCategoryDialog {...assignTransactionCategory} />
      <EditTransactionCategoryDialog {...editTransactionCategory} />
      <WeeklyTransactionsDialog
        open={weeklyTransactionsDialog.open}
        onClose={handleCloseWeeklyTransactions}
        accountId={weeklyTransactionsDialog.accountId}
        type={weeklyTransactionsDialog.type}
        title={weeklyTransactionsDialog.title}
        getActions={getGridActions}
        onTransactionClick={editTransaction.openDialog}
      />
    </Page>
  );
}
