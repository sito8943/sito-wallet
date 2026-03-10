import type { ReactNode } from "react";

import type { AppFeatures, FeatureFlagKey } from "lib";

export type BasicProviderPropTypes = {
  children: ReactNode;
};

export type FeatureFlagsContextType = {
  features: AppFeatures;
  isFeatureEnabled: (key: FeatureFlagKey) => boolean;
  refreshFeatures: () => Promise<AppFeatures>;
  clearFeatures: () => void;
};
