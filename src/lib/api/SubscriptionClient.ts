import type { QueryParam, QueryResult } from "@sito/dashboard-app";
import { BaseClient, Methods, parseQueries } from "@sito/dashboard-app";

import { Tables } from "./types";

import type {
  AddSubscriptionBillingLogDto,
  AddSubscriptionRenewalDto,
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
  subscriptionId?: number;
  from?: string;
  to?: string;
};

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
    const searchParams = new URLSearchParams();

    if (filters?.subscriptionId) {
      searchParams.set("subscriptionId", String(filters.subscriptionId));
    }
    if (filters?.from) {
      searchParams.set("from", filters.from);
    }
    if (filters?.to) {
      searchParams.set("to", filters.to);
    }

    const queryString = searchParams.toString();
    const builtUrl = queryString
      ? `${this.table}/renewals?${queryString}`
      : `${this.table}/renewals`;

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
    return await this.api.post(
      `${this.table}/${subscriptionId}/billing-logs`,
      data,
    );
  }

  async createRenewal(
    subscriptionId: number,
    data: AddSubscriptionRenewalDto = {},
  ): Promise<number> {
    return await this.api.post(
      `${this.table}/${subscriptionId}/renewals`,
      data,
    );
  }

  async getBillingLogs(
    subscriptionId: number,
    query?: QueryParam<SubscriptionBillingLogDto>,
    filters?: FilterSubscriptionBillingLogDto,
  ): Promise<QueryResult<SubscriptionBillingLogDto>> {
    const builtUrl = parseQueries<
      SubscriptionBillingLogDto,
      FilterSubscriptionBillingLogDto
    >(`${this.table}/${subscriptionId}/billing-logs`, query, filters);

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
