import type { AppFeatures, AppFeaturesPayload, FeatureFlagKey } from "lib";

export type FeatureFlagsContextType = {
  features: AppFeatures;
  isFeatureEnabled: (key: FeatureFlagKey) => boolean;
  refreshFeatures: () => Promise<AppFeatures>;
  applyFeaturePayload: (payload: AppFeaturesPayload) => AppFeatures;
  clearFeatures: () => void;
};
