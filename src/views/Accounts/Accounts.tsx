import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// providers
import { useManager } from "providers";

// components
import { ConfirmationDialog, Error, Page, PrettyGrid } from "components";
import { AddAccountDialog, AccountCard, EditAccountDialog } from "./components";

// hooks
import {
  useDeleteDialog,
  useAccountsList,
  AccountsQueryKeys,
  useRestoreDialog,
} from "hooks";
import { useAddAccount, useEditAccount } from "./hooks";

// types
import { AccountDto } from "lib";

export function Accounts() {
  const { t } = useTranslation();

  const manager = useManager();

  const { data, isLoading, error } = useAccountsList({});

  console.log(data);

  // #region actions

  const deleteAccount = useDeleteDialog({
    mutationFn: (data) => manager.Accounts.softDelete(data),
    ...AccountsQueryKeys.all(),
  });

  const restoreAccount = useRestoreDialog({
    mutationFn: (data) => manager.Accounts.restore(data),
    ...AccountsQueryKeys.all(),
  });

  const addAccount = useAddAccount();

  const editAccount = useEditAccount();

  // #endregion

  const getActions = useCallback(
    (record: AccountDto) => [
      deleteAccount.action(record),
      restoreAccount.action(record),
    ],
    [deleteAccount, restoreAccount]
  );

  return (
    <Page
      title={t("_pages:accounts.title")}
      isLoading={isLoading}
      addOptions={{
        onClick: () => addAccount.onClick(),
        disabled: isLoading,
        tooltip: t("_pages:accounts.add"),
      }}
    >
      {!error ? (
        <>
          <PrettyGrid
            data={data?.items}
            emptyMessage={t("_pages:accounts.empty")}
            renderComponent={(account) => (
              <AccountCard
                actions={getActions(account)}
                onClick={(id: number) => editAccount.onClick(id)}
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
