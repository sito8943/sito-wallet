import { TabsLayout } from "@sito/dashboard-app";
import type { TransactionsDesktopSectionProps } from "./types";

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
