import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faWallet } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import {
  useDeleteDialog,
  useRestoreDialog,
  useExportActionMutate,
  Page,
  Error,
  Empty,
  GlobalActions,
  ConfirmationDialog,
  useImportDialog,
  ImportDialog,
  useNotification,
  PrettyGrid,
} from "@sito/dashboard-app";

// providers
import {
  useFeatureFlags,
  useManager,
  useRegisterBottomNavAction,
} from "providers";

// components
import {
  AddAccountDialog,
  AccountCard,
  EditAccountDialog,
  AdjustBalanceDialog,
  TransferDialog,
} from "./components";
import { AddTransactionDialog } from "../Transactions/components/AddTransactionDialog";
import { MobileSelectionBar } from "components";

// hooks
import {
  useInfiniteAccountsList,
  AccountsQueryKeys,
  useMobileNavbar,
  useMobileMultiSelection,
  useSwipeDeleteState,
} from "hooks";
import {
  useAddAccountDialog,
  useEditAccountDialog,
  useSyncAccountMutation,
  useViewTransactionsAction,
  useAdjustBalanceMutation,
  useTransferDialog,
} from "./hooks";
import { useAddTransaction } from "../Transactions/hooks/useAddTransaction";

// types
import type {
  AccountDto,
  FilterAccountDto,
  ImportPreviewAccountDto,
} from "lib";
import { AccountActions } from "./types";
import { getDeleteAction } from "../../components/Card/utils";
import {
  Tables,
  isFeatureDisabledBusinessError,
  defaultAccountsListFilters,
  normalizeListFilters,
} from "lib";

// styles
import "./styles.css";

export function Accounts() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

  const manager = useManager();
  const { isFeatureEnabled } = useFeatureFlags();
  const transactionsEnabled = isFeatureEnabled("transactionsEnabled");

  const [selectedTransactionAccount, setSelectedTransactionAccount] =
    useState<AccountDto | null>(null);

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteAccountsList({});

  const items = useMemo(
    () => data?.pages?.flatMap((page) => page.items) ?? [],
    [data?.pages],
  );

  useEffect(() => {
    if (!isFeatureDisabledBusinessError(error)) return;

    showErrorNotification({
      message: t("_pages:featureFlags.moduleUnavailable"),
    });
  }, [error, showErrorNotification, t]);

  // #region actions

  const viewTransactions = useViewTransactionsAction({});

  const addTransaction = useAddTransaction({
    account: selectedTransactionAccount,
  });

  const transfer = useTransferDialog();

  const deleteAccount = useDeleteDialog({
    mutationFn: (data) => manager.Accounts.softDelete(data),
    ...AccountsQueryKeys.all(),
  });
  const accountSwipeDelete = useSwipeDeleteState(deleteAccount.handleClose);

  const restoreAccount = useRestoreDialog({
    mutationFn: (data) => manager.Accounts.restore(data),
    ...AccountsQueryKeys.all(),
  });

  const addAccount = useAddAccountDialog();

  const editAccount = useEditAccountDialog();

  const exportAccounts = useExportActionMutate({
    entity: Tables.Accounts,
    mutationFn: () =>
      manager.Accounts.export(
        normalizeListFilters(defaultAccountsListFilters) as FilterAccountDto,
      ),
  });

  const importAccounts = useImportDialog<AccountDto, ImportPreviewAccountDto>({
    entity: Tables.Accounts,
    fileProcessor: (file, options) =>
      manager.Accounts.processImport(file, options?.override),
    mutationFn: (data) => manager.Accounts.import(data),
    ...AccountsQueryKeys.all(),
  });

  const syncAccount = useSyncAccountMutation();

  const adjustBalance = useAdjustBalanceMutation();

  // #endregion

  const getActions = useCallback(
    (record: AccountDto) => [
      {
        id: AccountActions.AddTransaction,
        hidden: !!record.deletedAt || !transactionsEnabled,
        disabled: !!record.deletedAt || !transactionsEnabled,
        icon: <FontAwesomeIcon className="account-action-icon" icon={faAdd} />,
        tooltip: t("_pages:accounts.actions.addTransaction.text"),
        onClick: () => {
          setSelectedTransactionAccount(record);
          addTransaction.openDialog();
        },
      },
      transfer.action(record),
      viewTransactions.action(record),
      adjustBalance.action(record),
      syncAccount.action(record),
      deleteAccount.action(record),
      // restore defaults to multiple:false in the lib; enable batch restore
      { ...restoreAccount.action(record), multiple: true },
    ],
    [
      addTransaction,
      adjustBalance,
      deleteAccount,
      restoreAccount,
      syncAccount,
      t,
      transfer,
      transactionsEnabled,
      viewTransactions,
    ],
  );

  const mobileSelection = useMobileMultiSelection<AccountDto>({
    items,
    getActions,
    onInteraction: accountSwipeDelete.resetSwipe,
  });

  const pageToolbar = useMemo(() => {
    return [exportAccounts.action(), importAccounts.action()];
  }, [exportAccounts, importAccounts]);

  useMobileNavbar(t("_pages:accounts.title"), pageToolbar);

  const openAddAccountRef = useRef(addAccount.openDialog);
  useEffect(() => {
    openAddAccountRef.current = addAccount.openDialog;
  }, [addAccount.openDialog]);
  useRegisterBottomNavAction(
    useCallback(() => openAddAccountRef.current(), []),
  );

  return (
    <Page
      title={t("_pages:accounts.title")}
      isLoading={isLoading}
      actions={pageToolbar}
      addOptions={{
        onClick: () => addAccount.openDialog(),
        disabled: isLoading,
        tooltip: t("_pages:accounts.add"),
      }}
      queryKey={AccountsQueryKeys.all().queryKey}
    >
      {!error ? (
        <>
          <MobileSelectionBar
            className="account-selection-bar"
            count={mobileSelection.selectedCount}
            multiActions={mobileSelection.multiActions}
            onActionClick={mobileSelection.onMultiActionClick}
            onCancel={mobileSelection.clearSelection}
          />
          <PrettyGrid
            data={items}
            className="accounts-grid"
            itemClassName="accounts-grid-item"
            hasMore={!!hasNextPage}
            loadingMore={isFetchingNextPage}
            onLoadMore={() => {
              if (!hasNextPage || isFetchingNextPage) return;
              void fetchNextPage();
            }}
            emptyComponent={
              <Empty
                message={t("_pages:accounts.empty")}
                iconProps={{
                  icon: faWallet,
                  className: "accounts-empty-icon",
                }}
                action={[
                  {
                    icon: <FontAwesomeIcon icon={faAdd} />,
                    id: GlobalActions.Add,
                    disabled: isLoading,
                    onClick: () => addAccount.openDialog(),
                    tooltip: t("_pages:accounts.add"),
                  },
                ]}
              />
            }
            renderComponent={(account) => {
              const actions = getActions(account);
              const deleteAction = getDeleteAction(actions);

              return (
                <AccountCard
                  actions={actions}
                  onClick={(id: number) => editAccount.openDialog(id)}
                  selectionMode={mobileSelection.selectionMode}
                  selected={mobileSelection.isSelected(account.id)}
                  onSelect={mobileSelection.onToggleRowSelection}
                  onLongPress={mobileSelection.onLongPressRow}
                  swipeDeleteOpen={
                    !mobileSelection.selectionMode &&
                    accountSwipeDelete.swipedId === account.id
                  }
                  onSwipeDelete={
                    deleteAction
                      ? () => {
                          accountSwipeDelete.openSwipe(account.id);
                          deleteAction.onClick(account);
                        }
                      : undefined
                  }
                  {...account}
                />
              );
            }}
          />
          {/* Dialogs */}
          <AddAccountDialog {...addAccount} />
          <AddTransactionDialog {...addTransaction} />
          <TransferDialog {...transfer} />
          <EditAccountDialog {...editAccount} />
          <ConfirmationDialog
            {...deleteAccount}
            handleClose={accountSwipeDelete.handleDialogClose}
          />
          <ConfirmationDialog {...restoreAccount} />
          <ImportDialog {...importAccounts} />
          <AdjustBalanceDialog {...adjustBalance} />
        </>
      ) : (
        <Error error={error} />
      )}
    </Page>
  );
}
