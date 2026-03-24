import { useCallback, useMemo } from "react";
import { css } from "@emotion/css";

// @sito/dashboard
import { Loading, SelectInput, useEditAction } from "@sito/dashboard-app";

// icons

// hooks
import {
  useAddAccountDialog,
  useEditAccountDialog,
  useSyncAccountMutation,
  useAdjustBalanceMutation,
} from "views/Accounts/hooks";

// lib
import { AccountDto } from "lib";

// types
import { AccountCarouselPropsType } from "./types";

// components
import { Error } from "@sito/dashboard-app";
import {
  AccountCard,
  AddAccountDialog,
  AdjustBalanceDialog,
  EditAccountDialog,
} from "views/Accounts";

const AccountShower = (props: AccountCarouselPropsType) => {
  const {
    className,
    accounts,
    selectedAccount: selectedAccountProp,
    isLoading,
    error,
    onAccountChange,
  } = props;

  const selectedAccount = useMemo(
    () => selectedAccountProp ?? (accounts ? accounts[0] : null),
    [accounts, selectedAccountProp],
  );

  // #region actions

  const addAccount = useAddAccountDialog();

  const editAccountDialog = useEditAccountDialog();

  const editAccountAction = useEditAction<AccountDto>({
    onClick: editAccountDialog.openDialog,
  });

  const syncAccount = useSyncAccountMutation();

  const adjustBalance = useAdjustBalanceMutation();

  // #endregion

  const getActions = useCallback(
    (record: AccountDto) => [
      adjustBalance.action(record),
      syncAccount.action(record),
      editAccountAction.action(record),
    ],
    [adjustBalance, editAccountAction, syncAccount],
  );

  return (
    <>
      <div className={`${className} relative`}>
        {isLoading && (
          <div className="flex gap-2 items-center justify-start pl-1">
            <Loading className="mt-0.5" loaderClass="w-10 h-10" />
          </div>
        )}
        {error && <Error />}
        <AccountCard
          containerClassName={css({
            width: `${window.innerWidth - 24}px`,
          })}
          showLastTransactions={false}
          showTypeResume
          actions={selectedAccount ? getActions(selectedAccount) : []}
          {...selectedAccount}
          hideDescription
          name={
            <div className="mb-4 w-full">
              <SelectInput
                value={selectedAccount?.id}
                onChange={(e) => {
                  onAccountChange(
                    Number((e.target as HTMLSelectElement).value),
                  );
                }}
                options={accounts ?? []}
              />
            </div>
          }
        />
      </div>
      {/* Dialogs */}
      <AddAccountDialog {...addAccount} />
      <EditAccountDialog {...editAccountDialog} />
      <AdjustBalanceDialog {...adjustBalance} />
    </>
  );
};

export default AccountShower;
