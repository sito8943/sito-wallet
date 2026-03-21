import { useCallback } from "react";
import { css } from "@emotion/css";

// @sito/dashboard
import { Loading } from "@sito/dashboard-app";

// hooks
import { useAccountsList } from "hooks";
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

const AccountCarousel = (props: AccountCarouselPropsType) => {
  const { className } = props;
  const { data, isLoading, error } = useAccountsList({});

  // #region actions

  const addAccount = useAddAccountDialog();

  const editAccount = useEditAccountDialog();

  const syncAccount = useSyncAccountMutation();

  const adjustBalance = useAdjustBalanceMutation();

  // #endregion

  const getActions = useCallback(
    (record: AccountDto) => [
      adjustBalance.action(record),
      syncAccount.action(record),
    ],
    [adjustBalance, syncAccount],
  );

  return (
    <>
      <div className={className}>
        {isLoading && (
          <div className="flex gap-2 items-center justify-start pl-1">
            <Loading className="mt-0.5" loaderClass="w-10 h-10" />
          </div>
        )}
        {error && <Error />}
        <ul className="flex gap-4 overflow-auto">
          {data?.items?.map((account) => (
            <li key={account.id}>
              <AccountCard
                containerClassName={css({
                  width: `${window.innerWidth - 24}px`,
                })}
                showLastTransactions={false}
                showTypeResume
                actions={getActions(account)}
                onClick={(id: number) => editAccount.openDialog(id)}
                {...account}
              />
            </li>
          ))}
        </ul>
      </div>
      {/* Dialogs */}
      <AddAccountDialog {...addAccount} />
      <EditAccountDialog {...editAccount} />
      <AdjustBalanceDialog {...adjustBalance} />
    </>
  );
};

export default AccountCarousel;
