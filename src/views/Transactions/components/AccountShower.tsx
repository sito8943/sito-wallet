import { useCallback, useMemo, useState } from "react";
import { css } from "@emotion/css";

// @sito/dashboard
import { AutocompleteInput, Loading } from "@sito/dashboard-app";

// icons

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

const AccountShower = (props: AccountCarouselPropsType) => {
  const { className } = props;
  const { data, isLoading, error } = useAccountsList({
    filters: {
      deletedAt: false,
    },
  });

  const accounts = useMemo(() => {
    return data?.items;
  }, [data]);

  const [selectedAccount, setSelectedAccount] = useState(
    accounts ? accounts[0] : null,
  );

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
      <div className={`${className} relative`}>
        {isLoading && (
          <div className="flex gap-2 items-center justify-start pl-1">
            <Loading className="mt-0.5" loaderClass="w-10 h-10" />
          </div>
        )}
        {error && <Error />}
        <AutocompleteInput
          value={selectedAccount}
          onChange={(value) => value && setSelectedAccount(value as AccountDto)}
          options={accounts ?? []}
        />
        {selectedAccount && (
          <AccountCard
            containerClassName={css({
              width: `${window.innerWidth - 40}px`,
            })}
            showLastTransactions={false}
            showTypeResume
            actions={getActions(selectedAccount)}
            onClick={(id: number) => editAccount.openDialog(id)}
            {...selectedAccount}
          />
        )}
      </div>
      {/* Dialogs */}
      <AddAccountDialog {...addAccount} />
      <EditAccountDialog {...editAccount} />
      <AdjustBalanceDialog {...adjustBalance} />
    </>
  );
};

export default AccountShower;
