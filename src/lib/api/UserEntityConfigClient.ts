import { APIClient, Methods } from "@sito/dashboard-app";

import { config } from "../../config";
import type {
  UserEntityConfigBatchDto,
  UserEntityConfigDto,
  UserEntityConfigResponse,
} from "./userEntityConfigs";
import { normalizeUserEntityConfigResponse } from "./userEntityConfigs";

export default class UserEntityConfigClient {
  private readonly endpoint = "user-entity-configs";

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

  async getAll(): Promise<UserEntityConfigDto[]> {
    const response = await this.api.doQuery<UserEntityConfigResponse>(
      this.endpoint,
      Methods.GET,
      undefined,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );

    return normalizeUserEntityConfigResponse(response);
  }

  async putBatch(
    payload: UserEntityConfigBatchDto,
  ): Promise<UserEntityConfigDto[]> {
    const response = await this.api.doQuery<UserEntityConfigResponse>(
      `${this.endpoint}/batch`,
      Methods.PUT,
      payload,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );

    return normalizeUserEntityConfigResponse(response);
  }

  async patchBatch(
    payload: UserEntityConfigBatchDto,
  ): Promise<UserEntityConfigDto[]> {
    const response = await this.api.doQuery<UserEntityConfigResponse>(
      `${this.endpoint}/batch`,
      Methods.PATCH,
      payload,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );

    return normalizeUserEntityConfigResponse(response);
  }
}
