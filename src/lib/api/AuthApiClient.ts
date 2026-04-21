import { APIClient, Methods } from "@sito/dashboard-app";

import { config } from "../../config";

export type ForgotPasswordDto = {
  email: string;
  redirectTo: string;
};

export type AcceptedResponseDto = {
  accepted: boolean;
  message: string;
};

export type ResetPasswordDto = {
  accessToken: string;
  newPassword: string;
};

export type ResendConfirmEmailDto = {
  email: string;
  redirectTo: string;
};

/**
 * Auth endpoints that are not exposed by the upstream AuthClient.
 */
export default class AuthApiClient {
  private api: APIClient = new APIClient(
    config.apiUrl,
    config.auth.user,
    false,
    undefined,
    {
      rememberKey: config.auth.remember,
      refreshTokenKey: config.auth.refreshTokenKey,
      accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
    },
  );

  async forgotPassword(data: ForgotPasswordDto): Promise<AcceptedResponseDto> {
    return await this.api.doQuery<AcceptedResponseDto>(
      "auth/password/forgot",
      Methods.POST,
      data,
    );
  }

  async resetPassword(data: ResetPasswordDto): Promise<void> {
    await this.api.doQuery<null>("auth/password/reset", Methods.POST, data);
  }

  async resendConfirmEmail(
    data: ResendConfirmEmailDto,
  ): Promise<AcceptedResponseDto> {
    return await this.api.doQuery<AcceptedResponseDto>(
      "auth/email/confirm/resend",
      Methods.POST,
      data,
    );
  }
}
