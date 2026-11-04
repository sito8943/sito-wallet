import { matchPath } from "react-router-dom";

import { AppRoutes } from "../routes";
import { NON_FEATURE_ROUTE_KEYS, WALLET_FEATURES } from "./constants";
import type { WalletFeature } from "./types";

const catalogue: ReadonlySet<string> = new Set(WALLET_FEATURES);

/** `transactionCategories` → `page.transaction_categories`. */
export const toPageFeature = (routeKey: string): string =>
  `page.${routeKey.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`)}`;

export const isWalletFeature = (feature: string): feature is WalletFeature =>
  catalogue.has(feature);

/** The page feature of a pathname, or null when it is not a known screen. */
export const pageFeatureOf = (pathname: string): WalletFeature | null => {
  for (const [key, path] of Object.entries(AppRoutes)) {
    if (NON_FEATURE_ROUTE_KEYS.includes(key)) continue;
    if (!matchPath({ path, end: true }, pathname)) continue;
    const feature = toPageFeature(key);
    return isWalletFeature(feature) ? feature : null;
  }
  return null;
};
