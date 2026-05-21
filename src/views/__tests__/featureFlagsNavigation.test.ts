import { describe, expect, it, vi } from "vitest";
import type { FeatureFlagKey } from "lib";

vi.mock("@sito/dashboard-app", () => ({
  filterMenuByFeatureFlags: (
    menu: Array<{ page?: string; type?: string }>,
    isFeatureEnabled: (key: FeatureFlagKey) => boolean,
    dependencies: Partial<Record<string, FeatureFlagKey>>,
  ) =>
    menu.filter((item) => {
      if (!item.page) return true;
      const dependency = dependencies[item.page];
      return dependency ? isFeatureEnabled(dependency) : true;
    }),
  filterSitemap: (
    routes: Array<{ key: string; children?: unknown[] }>,
    isFeatureEnabled: (key: FeatureFlagKey) => boolean,
    dependencies: Partial<Record<string, FeatureFlagKey>>,
  ) =>
    routes.filter((route) => {
      const dependency = dependencies[route.key];
      return dependency ? isFeatureEnabled(dependency) : true;
    }),
  createPathMap: (routes: Array<{ key: string; path: string }>) =>
    Object.fromEntries(routes.map((route) => [route.key, route.path])),
  findPathInSitemap: (
    routes: Array<{ key: string; path: string }>,
    targetPageId: string,
  ) => routes.find((route) => route.key === targetPageId)?.path,
  flattenSitemap: (
    routes: Array<{ key: string; path: string }>,
    getName: (route: { key: string; path: string }) => string,
  ) => routes.map((route) => ({ ...route, name: getName(route) })),
  normalizeMenuDividers: (menu: Array<{ type?: string }>) =>
    menu.filter(
      (item, index, items) =>
        item.type !== "divider" ||
        (index > 0 &&
          index < items.length - 1 &&
          items[index - 1]?.type !== "divider"),
    ),
}));

vi.mock("lib", () => ({
  AppRoutes: {
    home: "/",
    profile: "/profile",
    users: "/users",
    transactions: "/transactions",
    transactionCategories: "/transaction-categories",
    subscriptions: "/subscriptions",
    subscriptionProviders: "/subscription-providers",
    accounts: "/accounts",
    currencies: "/currencies",
    notFound: "*",
    about: "/about-us",
    cookiesPolicy: "/cookies-policy",
    termsAndConditions: "/terms-and-conditions",
    privacyPolicy: "/privacy-policy",
    signOut: "/sign-out",
    signIn: "/auth/sign-in",
  },
  isAdminSession: () => false,
}));

import { getFeatureFilteredMenuMap, MenuKeys } from "../menuMap";
import { getFeatureFilteredSitemap, PageId } from "../sitemap";

const checker =
  (enabled: Partial<Record<FeatureFlagKey, boolean>>) =>
  (key: FeatureFlagKey): boolean => {
    return enabled[key] ?? true;
  };

describe("feature flags navigation guards", () => {
  it("hides disabled module entries from menu", () => {
    const menu = getFeatureFilteredMenuMap(
      checker({
        transactionsEnabled: false,
        subscriptionsEnabled: false,
        accountsEnabled: true,
        currenciesEnabled: true,
        transactionCategoriesEnabled: false,
      }),
    );

    const menuPages = menu.map((item) => item.page).filter(Boolean);

    expect(menuPages).not.toContain(MenuKeys.Transactions);
    expect(menuPages).not.toContain(MenuKeys.TransactionCategories);
    expect(menuPages).not.toContain(MenuKeys.Subscriptions);
    expect(menuPages).toContain(MenuKeys.Accounts);
  });

  it("hides disabled module routes from sitemap", () => {
    const routes = getFeatureFilteredSitemap(
      checker({
        transactionsEnabled: false,
        subscriptionsEnabled: false,
        accountsEnabled: false,
        currenciesEnabled: true,
        transactionCategoriesEnabled: false,
      }),
    );

    const pageKeys = routes.map((route) => route.key);

    expect(pageKeys).not.toContain(PageId.Transactions);
    expect(pageKeys).not.toContain(PageId.TransactionCategories);
    expect(pageKeys).not.toContain(PageId.Subscriptions);
    expect(pageKeys).not.toContain(PageId.SubscriptionProviders);
    expect(pageKeys).not.toContain(PageId.Accounts);
    expect(pageKeys).toContain(PageId.Currencies);
  });
});
