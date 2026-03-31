import { TabsLayout } from "@sito/dashboard-app";

import AccountShower from "../components/AccountShower";
import type { TransactionsMobileSectionProps } from "./types";

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
        className="sm:hidden mb-4"
      />
      <TabsLayout
        currentTab={tabValue}
        tabs={tabs}
        className="min-sm:hidden"
        tabsContainerClassName="mobile-account-tabs"
      />
    </>
  );
};

export default TransactionsMobileSection;
