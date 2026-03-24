import { TabsLayout, TabsType } from "@sito/dashboard-app";

type TransactionsDesktopSectionProps = {
  tabValue?: number;
  tabs: TabsType[];
};

export const TransactionsDesktopSection = (
  props: TransactionsDesktopSectionProps,
) => {
  const { tabValue, tabs } = props;

  return (
    <TabsLayout
      defaultTab={tabValue}
      tabs={tabs}
      className="max-sm:hidden"
      tabsContainerClassName="account-tabs"
    />
  );
};

export default TransactionsDesktopSection;