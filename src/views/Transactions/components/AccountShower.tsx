import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { css } from "@emotion/css";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import { IconButton, Loading, SelectInput, useEditAction } from "@sito/dashboard-app";

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

  const mobileCardWidthClass = css({
    width: `${window.innerWidth - 24}px`,
  });
  const accountNameRef = useRef<HTMLDivElement>(null);
  const [showFixedAccountSelector, setShowFixedAccountSelector] = useState(false);
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
    <div className="flex items-center gap-2">
      <div className="w-full">
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
        className="!w-10 !h-10 !min-w-10"
      />
    </div>
  );

  return (
    <>
      <div className={`${className}`}>
        {isLoading && (
          <div className="flex gap-2 items-center justify-start pl-1">
            <Loading className="mt-0.5" loaderClass="w-10 h-10" />
          </div>
        )}
        {error && <Error />}
        <div
          className={`w-screen bg-base-light fixed left-0 top-12 z-30 px-4 py-2 origin-top transition-all duration-200 ease-out ${
            showFixedAccountSelector
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
          }`}
        >
          {renderAccountSelector("account-id-fixed", "account-id-fixed")}
        </div>
        <AccountCard
          containerClassName={mobileCardWidthClass}
          showLastTransactions={false}
          showTypeResume
          showCurrency={false}
          actions={selectedAccount ? getActions(selectedAccount) : []}
          {...selectedAccount}
          hideDescription
          name={
            <div
              ref={accountNameRef}
              className={`mb-2 w-full sticky top-14 bg-base-light rounded-lg transition-opacity duration-200 ${
                showFixedAccountSelector ? "opacity-0 pointer-events-none" : ""
              }`}
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
