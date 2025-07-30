import { useMemo, useState } from "react";

// types
import { TabsLayoutPropsType } from "./types";

// components
import { Tab } from "./Tab";

// styles
import "./styles.css";

export const TabsLayout = (props: TabsLayoutPropsType) => {
  const { tabs = [], defaultTab, className = "" } = props;

  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id);

  const current = useMemo(
    () => tabs.find((item) => item.id === activeTab),
    [tabs, activeTab]
  );

  return (
    <div
      className={`bg-alt-background mt-5 rounded-b-xl rounded-r-xl ${className}`}
    >
      <ul className="horizontal tabs flex w-full items-center justify-start -mt-6">
        {tabs.map(({ id, label }) => (
          <li key={id}>
            <Tab
              onClick={() => setActiveTab(id)}
              id={id}
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
