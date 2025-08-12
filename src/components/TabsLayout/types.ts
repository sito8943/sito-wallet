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
  to?: string;
};

export type TabPropsType = {
  children: ReactNode;
  id: number | string;
  to?: string;
  active: boolean;
  onClick: () => void;
  siblings?: boolean;
};
