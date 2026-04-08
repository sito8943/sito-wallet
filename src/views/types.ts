import type { ReactNode } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { FeatureFlagKey } from "lib";

// lib

import type { PageId } from "./sitemap";
import type { MenuKeys } from "./menuMap";

export type ViewPageType = {
  key: PageId;
  path: string;
  children?: ViewPageType[];
  role?: string[];
};

export interface NamedViewPageType extends ViewPageType {
  name: string;
}

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

export type IsFeatureEnabled = (key: FeatureFlagKey) => boolean;

export type BottomNavItemType = {
  id: string;
  page: PageId;
  to: string;
  icon: IconDefinition;
  position: "left" | "right";
};
