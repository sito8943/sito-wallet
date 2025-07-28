import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// providers
import { useManager } from "providers";

// components
import { ConfirmationDialog, Error, Page, PrettyGrid } from "components";
import { AddWalletDialog, WalletCard, EditWalletDialog } from "./components";

// hooks
import {
  useDeleteDialog,
  useWalletsList,
  WalletsQueryKeys,
  useRestoreDialog,
} from "hooks";
import { useAddWallet, useEditWallet } from "./hooks";

// types
import { WalletDto } from "lib";

export function Wallets() {
  const { t } = useTranslation();

  const manager = useManager();

  const { data, isLoading, error } = useWalletsList({});

  // #region actions

  const deleteWallet = useDeleteDialog({
    mutationFn: (data) => manager.Wallets.softDelete(data),
    ...WalletsQueryKeys.all(),
  });

  const restoreWallet = useRestoreDialog({
    mutationFn: (data) => manager.Wallets.restore(data),
    ...WalletsQueryKeys.all(),
  });

  const addWallet = useAddWallet();

  const editWallet = useEditWallet();

  // #endregion

  const getActions = useCallback(
    (record: WalletDto) => [
      deleteWallet.action(record),
      restoreWallet.action(record),
    ],
    [deleteWallet, restoreWallet]
  );

  return (
    <Page
      title={t("_pages:wallets.title")}
      isLoading={isLoading}
      addOptions={{
        onClick: () => addWallet.onClick(),
        disabled: isLoading,
        tooltip: t("_pages:wallets.add"),
      }}
    >
      {!error ? (
        <>
          <PrettyGrid
            data={data?.items}
            emptyMessage={t("_pages:wallets.empty")}
            renderComponent={(wallet) => (
              <WalletCard
                actions={getActions(wallet)}
                onClick={(id: number) => editWallet.onClick(id)}
                {...wallet}
              />
            )}
          />
          {/* Dialogs */}
          <AddWalletDialog {...addWallet} />
          <EditWalletDialog {...editWallet} />
          <ConfirmationDialog {...deleteWallet} />
          <ConfirmationDialog {...restoreWallet} />
        </>
      ) : (
        <Error message={error?.message} />
      )}
    </Page>
  );
}
