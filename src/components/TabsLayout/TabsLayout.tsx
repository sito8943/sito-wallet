import { useEffect, useMemo, useState } from "react";

// types
import { TabsLayoutPropsType } from "./types";

// components
import { Tab } from "./Tab";

// styles
import "./styles.css";

export const TabsLayout = (props: TabsLayoutPropsType) => {
  const {
    tabs = [],
    defaultTab,
    className = "",
    tabsContainerClassName = "",
  } = props;
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  const current = useMemo(() => {
    return tabs.find((item) => item.id === activeTab);
  }, [tabs, activeTab]);

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  return (
    <div className={`tabs-layout-main ${className}`}>
      <ul
        className={`horizontal tabs tabs-container ${tabsContainerClassName}`}
      >
        {tabs.map(({ id, to, label }) => (
          <li key={id}>
            <Tab
              onClick={() => setActiveTab(id)}
              id={id}
              to={to ?? ""}
              siblings={tabs.length > 1}
              active={activeTab === id}
            >
              {label}
            </Tab>
          </li>
        ))}
      </ul>
      {current?.content}
    </div>
  );
};
