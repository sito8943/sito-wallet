import { BaseClient } from "@sito/dashboard-app";

import { Tables } from "./types";

import {
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
}
