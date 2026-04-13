import { BaseClient } from "@sito/dashboard-app";

import { Tables } from "./types";

import {
  AddSubscriptionProviderDto,
  CommonSubscriptionProviderDto,
  FilterSubscriptionProviderDto,
  ImportPreviewDto,
  SubscriptionProviderDto,
  UpdateSubscriptionProviderDto,
} from "lib";

import { config } from "../../config";

export default class SubscriptionProviderClient extends BaseClient<
  Tables,
  SubscriptionProviderDto,
  CommonSubscriptionProviderDto,
  AddSubscriptionProviderDto,
  UpdateSubscriptionProviderDto,
  FilterSubscriptionProviderDto,
  ImportPreviewDto
> {
  constructor() {
    super(
      Tables.SubscriptionProviders,
      config.apiUrl,
      config.auth.user,
      true,
      {
        rememberKey: config.auth.remember,
        refreshTokenKey: config.auth.refreshTokenKey,
        accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
      },
    );
  }

}
