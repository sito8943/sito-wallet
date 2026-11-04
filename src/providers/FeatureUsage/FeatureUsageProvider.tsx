import { useState } from "react";

// @sito/feature-usage
import { createTracker } from "@sito/feature-usage";
import { FeatureUsageProvider as BaseFeatureUsageProvider } from "@sito/feature-usage/react";

// lib
import { WALLET_FEATURES } from "lib";

// types
import type { BasicProviderPropTypes } from "../types";

// components
import { PageUsageTracker } from "./PageUsageTracker";

// config
import { config } from "../../config";

/**
 * Anonymous feature usage (sito-feature-usage): counts which screens and
 * features are used, never who uses them. Without VITE_USAGE_URL it is off.
 */
export const FeatureUsageProvider = ({ children }: BasicProviderPropTypes) => {
  // One tracker for the app's lifetime; it is not stopped on unmount so
  // StrictMode's double effects cannot leave it without timers.
  const [tracker] = useState(() =>
    createTracker({
      app: config.featureUsage.app,
      key: config.featureUsage.key,
      endpoint: config.featureUsage.url,
      features: WALLET_FEATURES,
    }),
  );

  return (
    <BaseFeatureUsageProvider tracker={tracker}>
      <PageUsageTracker />
      {children}
    </BaseFeatureUsageProvider>
  );
};
