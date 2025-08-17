import { APIClient } from "./APIClient";

// entities
import { AuthDto, RegisterDto, SessionDto } from "../entities";
import { Methods } from "./utils/services";

export default class AuthClient {
  api: APIClient = new APIClient(false);

  constructor() {
    // Initialization logic if needed
  }

  async login(data: AuthDto) {
    const endpoint = "auth/sign-in";
    const body = data;
    return await this.api.doQuery<SessionDto, AuthDto>(
      endpoint,
      Methods.POST,
      body
    );
  }

  async logout() {
    const endpoint = "auth/sign-out";
    return await this.api.doQuery<void>(endpoint, Methods.POST);
  }

  async register(userData: RegisterDto) {
    const endpoint = "auth/sign-up";
    return await this.api.doQuery<SessionDto, RegisterDto>(
      endpoint,
      Methods.POST,
      userData
    );
  }

  async getSession() {
    const endpoint = "auth/session";

    return await this.api.doQuery<SessionDto>(endpoint, Methods.GET, null, {
      ...this.api.defaultTokenAdquierer(),
    });
  }
}
