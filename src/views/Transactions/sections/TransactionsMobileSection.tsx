import { TabsLayout, TabsType } from "@sito/dashboard-app";

import { AccountDto } from "lib";

import AccountShower from "../components/AccountShower";

type TransactionsMobileSectionProps = {
  accounts: AccountDto[];
  selectedAccount?: AccountDto | null;
  isAccountLoading?: boolean;
  accountError: Error | null;
  onAccountChange: (accountId: number) => void;
  onOpenFilters: () => void;
  tabValue?: number;
  tabs: TabsType[];
};

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
