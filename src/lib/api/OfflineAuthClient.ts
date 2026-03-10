import {
  AuthClient,
  type APIClientAuthConfig,
  type AuthDto,
  type HttpError,
  type RefreshDto,
  type RegisterDto,
  type SessionDto,
} from "@sito/dashboard-app";

const OFFLINE_AUTH_MESSAGE = "Offline mode is active";

const createOfflineAuthError = (): HttpError =>
  Object.assign(new Error(OFFLINE_AUTH_MESSAGE), {
    name: "OfflineAuthError",
    status: 503,
    message: OFFLINE_AUTH_MESSAGE,
  });

export class OfflineAuthClient extends AuthClient {
  constructor(userKey?: string, authConfig?: APIClientAuthConfig) {
    super("", userKey, authConfig);
  }

  async login(_data: AuthDto): Promise<SessionDto> {
    throw createOfflineAuthError();
  }

  async refresh(_data: RefreshDto): Promise<SessionDto> {
    throw createOfflineAuthError();
  }

  async register(_userData: RegisterDto): Promise<SessionDto> {
    throw createOfflineAuthError();
  }

  async getSession(): Promise<SessionDto> {
    throw createOfflineAuthError();
  }

  async logout(_options?: Parameters<AuthClient["logout"]>[0]): Promise<void> {
    return;
  }
}
