import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

// providers
import { useManager } from "providers";

// icons
import { faAdd, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// components
import { ConfirmationDialog, Empty, Error, Page, PrettyGrid } from "components";
import { AddAccountDialog, AccountCard, EditAccountDialog } from "./components";

// hooks
import {
  useDeleteDialog,
  useAccountsList,
  AccountsQueryKeys,
  useRestoreDialog,
  useExportActionMutate,
  GlobalActions,
} from "hooks";
import {
  useAddAccountDialog,
  useEditAccountDialog,
  useSyncAccountMutation,
  useViewTransactionsAction,
} from "./hooks";

// types
import { AccountDto, Tables } from "lib";

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
    return [exportAccounts.action()];
  }, [exportAccounts]);

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
        </>
      ) : (
        <Error message={error?.message} />
      )}
    </Page>
  );
}
