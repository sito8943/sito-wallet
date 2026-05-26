import {
  APIClient,
  Methods,
  RestAuthApiClient,
  type APIClientAuthConfig,
  type IAuthApiClient,
  type RestAuthApiClientOptions,
} from "@sito/dashboard-app";

import type { ChangePasswordDto } from "../entities";

export interface WalletAuthApiClient extends IAuthApiClient {
  changePassword(data: ChangePasswordDto): Promise<void>;
}

export class AuthApiClient
  extends RestAuthApiClient
  implements WalletAuthApiClient
{
  private securedApi: APIClient;

  constructor(
    baseUrl: string,
    userKey?: string,
    authConfig?: APIClientAuthConfig,
    options?: RestAuthApiClientOptions,
  ) {
    super(baseUrl, userKey, authConfig, options);
    this.securedApi = new APIClient(
      baseUrl,
      userKey,
      true,
      undefined,
      authConfig,
    );
  }

  async changePassword(data: ChangePasswordDto): Promise<void> {
    await this.securedApi.doQuery("auth/password/change", Methods.POST, data);
  }
}
