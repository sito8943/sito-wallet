import { useLocation } from "react-router-dom";

// @sito/feature-usage
import { useTrackPage } from "@sito/feature-usage/react";

// lib
import { pageFeatureOf } from "lib";
import type { WalletFeature } from "lib";

/** Counts one use of the current screen each time the route changes. */
export const PageUsageTracker = () => {
  const { pathname } = useLocation();
  useTrackPage<WalletFeature>(pageFeatureOf(pathname));
  return null;
};
