import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import {
  useDeleteDialog,
  useRestoreDialog,
  useExportActionMutate,
  GlobalActions,
  PrettyGrid,
  Page,
  Empty,
  Error,
  ConfirmationDialog,
  useImportDialog,
  ImportDialog,
} from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// icons
import { faAdd, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// components
import { AddAccountDialog, AccountCard, EditAccountDialog } from "./components";

// hooks
import { useAccountsList, AccountsQueryKeys } from "hooks";
import {
  useAddAccountDialog,
  useEditAccountDialog,
  useSyncAccountMutation,
  useViewTransactionsAction,
} from "./hooks";

// types
import { AccountDto, Tables, ImportPreviewAccountDto } from "lib";

export function Accounts() {
  const { t } = useTranslation();

  const manager = useManager();

  const { data, isLoading, error } = useAccountsList({});

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
    mutationFn: () => manager.Accounts.export(),
  });

  const importAccounts = useImportDialog<AccountDto, ImportPreviewAccountDto>({
    entity: Tables.Accounts,
    fileProcessor: (file, options) =>
      manager.Accounts.processImport(file, options?.override),
    mutationFn: (data) => manager.Accounts.import(data),
    ...AccountsQueryKeys.all(),
  });

  const syncAccount = useSyncAccountMutation();

  // #endregion

  const getActions = useCallback(
    (record: AccountDto) => [
      viewTransactions.action(record),
      syncAccount.action(record),
      deleteAccount.action(record),
      restoreAccount.action(record),
    ],
    [deleteAccount, restoreAccount, syncAccount, viewTransactions]
  );

  const pageToolbar = useMemo(() => {
    return [exportAccounts.action(), importAccounts.action()];
  }, [exportAccounts, importAccounts]);

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
          <PrettyGrid
            data={data?.items}
            emptyComponent={
              <Empty
                message={t("_pages:accounts.empty")}
                iconProps={{
                  icon: faWallet,
                  className: "text-5xl max-md:text-3xl text-gray-400",
                }}
                action={{
                  icon: <FontAwesomeIcon icon={faAdd} />,
                  id: GlobalActions.Add,
                  disabled: isLoading,
                  onClick: () => addAccount.openDialog(),
                  tooltip: t("_pages:accounts.add"),
                }}
              />
            }
            renderComponent={(account) => (
              <AccountCard
                actions={getActions(account)}
                onClick={(id: number) => editAccount.openDialog(id)}
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
        </>
      ) : (
        <Error error={error} />
      )}
    </Page>
  );
}
