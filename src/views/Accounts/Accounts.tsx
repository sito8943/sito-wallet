import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import {
  useDeleteDialog,
  useRestoreDialog,
  useExportActionMutate,
  Page,
  Error,
  ConfirmationDialog,
  useImportDialog,
  ImportDialog,
  useNotification,
  PrettyGrid,
} from "@sito/dashboard-app";

// providers
import { useManager, useRegisterBottomNavAction } from "providers";

// components
import {
  AddAccountDialog,
  AccountCard,
  EditAccountDialog,
  AdjustBalanceDialog,
} from "./components";
import { MobileSelectionBar, PrefabAccountSuggestions } from "components";

// hooks
import {
  useInfiniteAccountsList,
  AccountsQueryKeys,
  useMobileNavbar,
  useMobileMultiSelection,
} from "hooks";
import {
  useAddAccountDialog,
  useEditAccountDialog,
  useSyncAccountMutation,
  useViewTransactionsAction,
  useAdjustBalanceMutation,
} from "./hooks";

// types
import type {
  AccountDto,
  FilterAccountDto,
  ImportPreviewAccountDto,
} from "lib";
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
  const queryClient = useQueryClient();

  const manager = useManager();

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

  const deleteAccount = useDeleteDialog({
    mutationFn: (data) => manager.Accounts.softDelete(data),
    ...AccountsQueryKeys.all(),
  });

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
      viewTransactions.action(record),
      adjustBalance.action(record),
      syncAccount.action(record),
      deleteAccount.action(record),
      restoreAccount.action(record),
    ],
    [
      adjustBalance,
      deleteAccount,
      restoreAccount,
      syncAccount,
      viewTransactions,
    ],
  );

  const mobileSelection = useMobileMultiSelection<AccountDto>({
    items,
    getActions,
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
            className="max-sm:pb-6"
            itemClassName="max-md:w-full w-auto"
            hasMore={!!hasNextPage}
            loadingMore={isFetchingNextPage}
            onLoadMore={() => {
              if (!hasNextPage || isFetchingNextPage) return;
              void fetchNextPage();
            }}
            emptyComponent={
              <PrefabAccountSuggestions
                onComplete={() =>
                  void queryClient.invalidateQueries({
                    queryKey: AccountsQueryKeys.all().queryKey,
                  })
                }
              />
            }
            renderComponent={(account) => (
              <AccountCard
                actions={getActions(account)}
                onClick={(id: number) => editAccount.openDialog(id)}
                selectionMode={mobileSelection.selectionMode}
                selected={mobileSelection.isSelected(account.id)}
                onSelect={mobileSelection.onToggleRowSelection}
                onLongPress={mobileSelection.onLongPressRow}
                {...account}
              />
            )}
          />
          {/* Dialogs */}
          <AddAccountDialog {...addAccount} />
          <EditAccountDialog {...editAccount} />
          <ConfirmationDialog {...deleteAccount} />
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
