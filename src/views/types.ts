import { ReactNode } from "react";

// lib

import { PageId } from "./sitemap";
import { MenuKeys } from "./menuMap";

export type ViewPageType = {
  key: PageId;
  path: string;
  children?: ViewPageType[];
};

export type SubMenuItemType = {
  label: string;
  path: string;
};

export type MenuItemType = {
  page?: MenuKeys;
  path?: string;
  icon?: ReactNode;
  type?: "menu" | "divider";
  auth?: boolean;
  child?: SubMenuItemType[];
};
