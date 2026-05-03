import { type HttpError } from "@sito/dashboard-app";

import type {
  AcceptedResponseDto,
  ConfirmEmailDto,
  ForgotPasswordDto,
  ResendConfirmEmailDto,
  ResetPasswordDto,
} from "./AuthApiClient";

const OFFLINE_AUTH_MESSAGE = "Offline mode is active";

const createOfflineAuthError = (): HttpError =>
  Object.assign(new Error(OFFLINE_AUTH_MESSAGE), {
    name: "OfflineAuthError",
    status: 503,
    message: OFFLINE_AUTH_MESSAGE,
  });

export class OfflineAuthApiClient {
  async forgotPassword(_data: ForgotPasswordDto): Promise<AcceptedResponseDto> {
    throw createOfflineAuthError();
  }

  async resetPassword(_data: ResetPasswordDto): Promise<void> {
    throw createOfflineAuthError();
  }

  async resendConfirmEmail(
    _data: ResendConfirmEmailDto,
  ): Promise<AcceptedResponseDto> {
    throw createOfflineAuthError();
  }

  async confirmEmail(_data: ConfirmEmailDto): Promise<void> {
    throw createOfflineAuthError();
  }
}
