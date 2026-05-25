import { TabsLayout } from "@sito/dashboard-app";
import type { TransactionsDesktopSectionProps } from "./types";

import "../styles.css";

export const TransactionsDesktopSection = (
  props: TransactionsDesktopSectionProps,
) => {
  const { tabValue, tabs } = props;

  return (
    <TabsLayout
      defaultTab={tabValue}
      tabs={tabs}
      className="transactions-desktop-tabs"
      tabsContainerClassName="account-tabs"
    />
  );
};

export default TransactionsDesktopSection;
