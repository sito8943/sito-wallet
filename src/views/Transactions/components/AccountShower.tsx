import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Error, Loading } from "@sito/dashboard-app";
import type { ActionType } from "@sito/dashboard-app";

// icons
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// hooks
import {
  useAddAccountDialog,
  useEditAccountDialog,
  useSyncAccountMutation,
  useAdjustBalanceMutation,
  useTransferDialog,
} from "views/Accounts/hooks";

// lib
import type { AccountDto } from "lib";

// types
import type { AccountCarouselPropsType } from "./types";

// components
import {
  AddAccountDialog,
  AdjustBalanceDialog,
  EditAccountDialog,
  TransferDialog,
  TypeResume,
} from "views/Accounts";
import { AccountSlider } from "./AccountSlider";

import "./styles.css";

const AccountShower = (props: AccountCarouselPropsType) => {
  const {
    className,
    accounts,
    selectedAccount: selectedAccountProp,
    isLoading,
    error,
    onAccountChange,
    onOpenFilters,
  } = props;
  const { t } = useTranslation();

  const selectedAccount = useMemo(
    () => selectedAccountProp ?? (accounts ? accounts[0] : null),
    [accounts, selectedAccountProp],
  );

  // #region actions

  const addAccount = useAddAccountDialog();

  const editAccountDialog = useEditAccountDialog();

  const editAccountAction = useCallback(
    (record: AccountDto): ActionType<AccountDto> => ({
      id: "edit",
      hidden: !!record.deletedAt,
      disabled: !!record.deletedAt,
      tooltip: t("_pages:common.actions.edit.text"),
      onClick: () => editAccountDialog.openDialog(record.id),
      icon: <FontAwesomeIcon className="account-action-icon" icon={faPencil} />,
    }),
    [editAccountDialog, t],
  );

  const syncAccount = useSyncAccountMutation();

  const adjustBalance = useAdjustBalanceMutation();

  const transfer = useTransferDialog();

  // #endregion

  const getActions = useCallback(
    (record: AccountDto) => [
      transfer.action(record),
      adjustBalance.action(record),
      syncAccount.action(record),
      editAccountAction(record),
    ],
    [adjustBalance, editAccountAction, syncAccount, transfer],
  );

  return (
    <>
      <div className={className}>
        {isLoading && (
          <div className="transaction-account-shower-loading">
            <Loading
              className="transaction-account-shower-loader"
              loaderClass="transaction-account-shower-loader-icon"
            />
          </div>
        )}
        {error && <Error />}
        <AccountSlider
          accounts={accounts ?? []}
          selectedAccount={selectedAccount}
          onAccountChange={onAccountChange}
          getActions={getActions}
          onOpenFilters={onOpenFilters}
        />
        {selectedAccount?.id && selectedAccount?.currency && (
          <TypeResume
            accountId={selectedAccount.id}
            currency={selectedAccount.currency}
          />
        )}
      </div>
      {/* Dialogs */}
      <AddAccountDialog {...addAccount} />
      <EditAccountDialog {...editAccountDialog} />
      <AdjustBalanceDialog {...adjustBalance} />
      <TransferDialog {...transfer} />
    </>
  );
};

export default AccountShower;
