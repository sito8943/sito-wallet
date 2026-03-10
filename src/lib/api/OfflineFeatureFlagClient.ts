import type { AppFeaturesPayload } from "./featureFlags/types";

export class OfflineFeatureFlagClient {
  async getFeatures(): Promise<AppFeaturesPayload> {
    return {};
  }
}
