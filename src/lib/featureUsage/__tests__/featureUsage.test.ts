import { describe, expect, it } from "vitest";
import { isValidFeature } from "@sito/feature-usage";

import { AppRoutes } from "../../routes";
import {
  NON_FEATURE_ROUTE_KEYS,
  WALLET_FEATURES,
  pageFeatureOf,
  toPageFeature,
} from "..";

describe("wallet feature usage catalogue", () => {
  it("lists only valid, unique names the service accepts", () => {
    expect(WALLET_FEATURES.every((f) => isValidFeature(f))).toBe(true);
    expect(new Set(WALLET_FEATURES).size).toBe(WALLET_FEATURES.length);
    expect(WALLET_FEATURES.length).toBeLessThanOrEqual(500);
  });

  it("has a page feature for every screen route", () => {
    const pages = Object.keys(AppRoutes)
      .filter((key) => !NON_FEATURE_ROUTE_KEYS.includes(key))
      .map(toPageFeature);
    expect([...pages].sort()).toEqual(
      WALLET_FEATURES.filter((f) => f.startsWith("page.")).sort(),
    );
  });
});

describe("pageFeatureOf", () => {
  it.each([
    ["/", "page.home"],
    ["/transactions", "page.transactions"],
    ["/transaction-categories", "page.transaction_categories"],
    ["/subscriptions/new", "page.subscription_new"],
    ["/subscriptions/42/edit", "page.subscription_edit"],
    ["/debts/7/edit", "page.debt_edit"],
    ["/auth/sign-in", "page.sign_in"],
    ["/about-us", "page.about"],
  ])("%s → %s", (pathname, feature) => {
    expect(pageFeatureOf(pathname)).toBe(feature);
  });

  it("ignores unknown paths and catch-alls", () => {
    expect(pageFeatureOf("/nope")).toBeNull();
    expect(pageFeatureOf("/auth/")).toBeNull();
    expect(pageFeatureOf("/auth/whatever")).toBeNull();
  });
});
