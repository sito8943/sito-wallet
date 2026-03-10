import { describe, expect, it } from "vitest";
import type { FeatureFlagKey } from "lib";

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
        accountsEnabled: true,
        currenciesEnabled: true,
        transactionCategoriesEnabled: false,
      }),
    );

    const menuPages = menu.map((item) => item.page).filter(Boolean);

    expect(menuPages).not.toContain(MenuKeys.Transactions);
    expect(menuPages).not.toContain(MenuKeys.TransactionCategories);
    expect(menuPages).toContain(MenuKeys.Accounts);
  });

  it("hides disabled module routes from sitemap", () => {
    const routes = getFeatureFilteredSitemap(
      checker({
        transactionsEnabled: false,
        accountsEnabled: false,
        currenciesEnabled: true,
        transactionCategoriesEnabled: false,
      }),
    );

    const pageKeys = routes.map((route) => route.key);

    expect(pageKeys).not.toContain(PageId.Transactions);
    expect(pageKeys).not.toContain(PageId.TransactionCategories);
    expect(pageKeys).not.toContain(PageId.Accounts);
    expect(pageKeys).toContain(PageId.Currencies);
  });
});
