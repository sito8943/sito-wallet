import { APIClient } from "./APIClient";

// entities
import { AuthDto, RegisterDto, SessionDto } from "../entities";

export default class AuthClient {
  api: APIClient = new APIClient();

  constructor() {
    // Initialization logic if needed
  }

  async login(data: AuthDto) {
    const endpoint = "/auth/login";
    const body = data;
    return await this.api.doQuery<SessionDto, AuthDto>(
      endpoint,
      "POST",
      "",
      body
    );
  }

  async logout() {
    const endpoint = "/auth/logout";
    return await this.api.doQuery<void>(endpoint, "POST");
  }

  async register(userData: RegisterDto) {
    const endpoint = "/auth/register";
    return await this.api.doQuery<SessionDto, RegisterDto>(
      endpoint,
      "POST",
      "",
      userData
    );
  }

  async getSession() {
    const endpoint = "/auth/session";
    return await this.api.doQuery<SessionDto>(endpoint, "GET");
  }
}
