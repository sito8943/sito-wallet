import {
  BaseFilterDto,
  BaseClient,
  Methods,
  QueryResult,
  parseQueries,
} from "@sito/dashboard-app";

import { Tables } from "./types";

import {
  AddSubscriptionBillingLogDto,
  AddSubscriptionDto,
  CommonSubscriptionDto,
  FilterSubscriptionBillingLogDto,
  FilterSubscriptionDto,
  ImportPreviewDto,
  SubscriptionBillingLogDto,
  SubscriptionDto,
  SubscriptionRenewalDto,
  UpdateSubscriptionDto,
} from "lib";

import { config } from "../../config";

export type GetSubscriptionRenewalsFilters = {
  from?: string;
  to?: string;
} & BaseFilterDto;

export default class SubscriptionClient extends BaseClient<
  Tables,
  SubscriptionDto,
  CommonSubscriptionDto,
  AddSubscriptionDto,
  UpdateSubscriptionDto,
  FilterSubscriptionDto,
  ImportPreviewDto
> {
  constructor() {
    super(Tables.Subscriptions, config.apiUrl, config.auth.user, true, {
      rememberKey: config.auth.remember,
      refreshTokenKey: config.auth.refreshTokenKey,
      accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
    });
  }

  async renewals(
    filters?: GetSubscriptionRenewalsFilters,
  ): Promise<SubscriptionRenewalDto[]> {
    const builtUrl = parseQueries<
      SubscriptionRenewalDto[],
      GetSubscriptionRenewalsFilters
    >(`${this.table}/renewals`, undefined, filters);

    return await this.api.doQuery<SubscriptionRenewalDto[]>(
      builtUrl,
      Methods.GET,
      undefined,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );
  }

  async createBillingLog(
    subscriptionId: number,
    data: AddSubscriptionBillingLogDto,
  ): Promise<number> {
    return await this.api.post(`${this.table}/${subscriptionId}/billing-logs`, data);
  }

  async getBillingLogs(
    subscriptionId: number,
    filters?: FilterSubscriptionBillingLogDto,
  ): Promise<QueryResult<SubscriptionBillingLogDto>> {
    const builtUrl = parseQueries<
      QueryResult<SubscriptionBillingLogDto>,
      FilterSubscriptionBillingLogDto
    >(`${this.table}/${subscriptionId}/billing-logs`, undefined, filters);

    return await this.api.doQuery<QueryResult<SubscriptionBillingLogDto>>(
      builtUrl,
      Methods.GET,
      undefined,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );
  }
}
