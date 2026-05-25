import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import {
  IconButton,
  Loading,
  SelectInput,
  classNames,
  useEditAction,
} from "@sito/dashboard-app";

// icons
import { faFilter } from "@fortawesome/free-solid-svg-icons";

// hooks
import {
  useAddAccountDialog,
  useEditAccountDialog,
  useSyncAccountMutation,
  useAdjustBalanceMutation,
} from "views/Accounts/hooks";

// lib
import type { AccountDto } from "lib";

// types
import type { AccountCarouselPropsType } from "./types";

// components
import { Error } from "@sito/dashboard-app";
import {
  AccountCard,
  AddAccountDialog,
  AdjustBalanceDialog,
  EditAccountDialog,
} from "views/Accounts";

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

  const accountNameRef = useRef<HTMLDivElement>(null);
  const [showFixedAccountSelector, setShowFixedAccountSelector] =
    useState(false);
  const stickyTopPx = 56;

  useEffect(() => {
    const handleScroll = () => {
      const accountNameElement = accountNameRef.current;
      if (!accountNameElement) {
        setShowFixedAccountSelector(false);
        return;
      }

      const { top } = accountNameElement.getBoundingClientRect();
      setShowFixedAccountSelector(top <= stickyTopPx);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const renderAccountSelector = (id: string, name: string) => (
    <div className="transaction-account-shower">
      <div className="transaction-account-shower-select">
        <SelectInput
          id={id}
          name={name}
          value={selectedAccount?.id}
          onChange={(e) => {
            onAccountChange(Number((e.target as HTMLSelectElement).value));
          }}
          options={accounts ?? []}
        />
      </div>
      <IconButton
        icon={faFilter}
        onClick={() => onOpenFilters?.()}
        name={t("_accessibility:buttons.filters")}
        aria-label={t("_accessibility:ariaLabels.filters")}
        className="transaction-account-shower-filter-button"
      />
    </div>
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
        <div
          className={classNames(
            "transaction-account-shower-panel",
            showFixedAccountSelector
              ? "transaction-account-shower-panel--visible"
              : "transaction-account-shower-panel--hidden",
          )}
        >
          {renderAccountSelector("account-id-fixed", "account-id-fixed")}
        </div>
        <AccountCard
          showLastTransactions={false}
          showTypeResume
          showCurrency={false}
          actions={selectedAccount ? getActions(selectedAccount) : []}
          {...selectedAccount}
          hideDescription
          containerClassName="transaction-account-shower-card"
          name={
            <div
              ref={accountNameRef}
              className={classNames(
                "transaction-account-shower-card-title",
                showFixedAccountSelector &&
                  "transaction-account-shower-card-title--hidden",
              )}
            >
              {renderAccountSelector("account-id", "account-id")}
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
