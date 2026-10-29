import { APIClient, BaseClient, Methods } from "@sito/dashboard-app";

import { Tables } from "./types";

import type {
  AddUserDto,
  CommonUserDto,
  FilterUserDto,
  ImportPreviewUserDto,
  UpdateUserDto,
  UserDto,
} from "lib";

import { config } from "../../config";

export default class UserClient extends BaseClient<
  Tables,
  UserDto,
  CommonUserDto,
  AddUserDto,
  UpdateUserDto,
  FilterUserDto,
  ImportPreviewUserDto,
  number,
  UserDto
> {
  private readonly walletApi = new APIClient(
    config.apiUrl,
    config.auth.user,
    true,
    undefined,
    config.auth.clientConfig,
  );

  constructor() {
    // Accounts are managed by sito-auth; only the wallet data reset stays on wallet.
    super(
      Tables.Users,
      config.authUrl,
      config.auth.user,
      true,
      config.auth.clientConfig,
    );
  }

  async reset(id: number, hard: boolean): Promise<void> {
    await this.walletApi.doQuery<void>(
      `${this.table}/${id}/reset`,
      Methods.POST,
      {
        hard,
      },
    );
  }
}
