import {
  faHome,
  faFileInvoice,
  faCreditCard,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import {
  filterNavigationByFeatureFlags,
  type BottomNavItemType,
  type FeatureEnabledFn,
} from "@sito/dashboard-app";

// sitemap;
import { PageId } from "./sitemap";

// lib
import { AppRoutes } from "lib";
import type { FeatureFlagKey } from "lib";

export const bottomMap: BottomNavItemType<PageId>[] = [
  {
    id: "home",
    page: PageId.Home,
    to: AppRoutes.home,
    icon: faHome,
    position: "left",
  },
  {
    id: "transactions",
    page: PageId.Transactions,
    to: AppRoutes.transactions,
    icon: faFileInvoice,
    position: "left",
  },
  {
    id: "accounts",
    page: PageId.Accounts,
    to: AppRoutes.accounts,
    icon: faCreditCard,
    position: "right",
  },
  {
    id: "profile",
    page: PageId.Profile,
    to: AppRoutes.profile,
    icon: faUser,
    position: "right",
  },
];

const bottomFeatureDependencies: Partial<Record<PageId, FeatureFlagKey>> = {
  [PageId.Transactions]: "transactionsEnabled",
  [PageId.Accounts]: "accountsEnabled",
};

export const getFeatureFilteredBottomMap = (
  isFeatureEnabled: FeatureEnabledFn<FeatureFlagKey>,
): BottomNavItemType<PageId>[] => {
  return filterNavigationByFeatureFlags(
    bottomMap,
    isFeatureEnabled,
    bottomFeatureDependencies,
  );
};
