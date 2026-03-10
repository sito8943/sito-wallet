import { APIClient, Methods } from "@sito/dashboard-app";

import { config } from "../../config";

import type {
  AppFeaturesPayload,
  AppFeaturesResponse,
} from "./featureFlags/types";
import { sanitizeFeaturePayload } from "../utils/featureFlags";

/**
 * Dedicated client for app feature flags.
 * This client does not represent a DB entity CRUD resource.
 */
export default class FeatureFlagClient {
  private api: APIClient = new APIClient(
    config.apiUrl,
    config.auth.user,
    true,
    undefined,
    {
      rememberKey: config.auth.remember,
      refreshTokenKey: config.auth.refreshTokenKey,
      accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
    },
  );

  async getFeatures(): Promise<AppFeaturesPayload> {
    const response = await this.api.doQuery<AppFeaturesResponse>(
      "app/features",
      Methods.GET,
      undefined,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );

    return sanitizeFeaturePayload(response.features);
  }
}
