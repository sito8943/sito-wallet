import { ReactNode } from "react";

export type TabsLayoutPropsType = {
  tabs: TabsType[];
  defaultTab?: number;
  className?: string;
  tabsContainerClassName?: string;
};

export type TabsType = {
  id: number | string;
  label: string;
  content: ReactNode;
};

export type TabPropsType = {
  children: ReactNode;
  id: number | string;
  active: boolean;
  onClick: () => void;
  siblings?: boolean;
};
