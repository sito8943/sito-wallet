import { TabsLayout } from "@sito/dashboard-app";

import AccountShower from "../components/AccountShower";
import type { TransactionsMobileSectionProps } from "./types";

import "../styles.css";

export const TransactionsMobileSection = (
  props: TransactionsMobileSectionProps,
) => {
  const {
    accounts,
    selectedAccount,
    isAccountLoading,
    accountError,
    onAccountChange,
    onOpenFilters,
    tabValue,
    tabs,
  } = props;

  return (
    <>
      <AccountShower
        accounts={accounts}
        selectedAccount={selectedAccount}
        isLoading={isAccountLoading}
        onAccountChange={onAccountChange}
        onOpenFilters={onOpenFilters}
        error={accountError}
        className="transactions-mobile-account-shower"
      />
      <TabsLayout
        currentTab={tabValue}
        tabs={tabs}
        className="transactions-mobile-tabs"
        tabsContainerClassName="mobile-account-tabs"
      />
    </>
  );
};

export default TransactionsMobileSection;
