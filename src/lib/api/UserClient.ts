import { BaseClient } from "@sito/dashboard-app";

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
  constructor() {
    super(Tables.Users, config.apiUrl, config.auth.user, true, {
      rememberKey: config.auth.remember,
      refreshTokenKey: config.auth.refreshTokenKey,
      accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
    });
  }

  async reset(id: number, hard: boolean): Promise<void> {
    await this.api.post<void, { hard: boolean }>(
      `${this.table}/${id}/reset`,
      { hard },
    );
  }
}
