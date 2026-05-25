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
  GetSubscriptionRenewalsQuery,
  ImportDto,
  ImportPreviewSubscriptionDto,
  SubscriptionBillingLogDto,
  SubscriptionDto,
  SubscriptionRenewalDto,
  SubscriptionRenewalForecastDto,
  UpdateSubscriptionDto,
} from "lib";
import { parseJSONFile } from "lib";

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
  ImportPreviewSubscriptionDto
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

  async renewalsForecast(
    query?: GetSubscriptionRenewalsQuery,
  ): Promise<SubscriptionRenewalForecastDto> {
    const searchParams = new URLSearchParams();

    if (query?.subscriptionId) {
      searchParams.set("subscriptionId", String(query.subscriptionId));
    }
    if (query?.range) {
      searchParams.set("range", query.range);
    }
    if (query?.timezone) {
      searchParams.set("timezone", query.timezone);
    }
    if (query?.month) {
      searchParams.set("month", query.month);
    }
    if (query?.from) {
      searchParams.set("from", query.from);
    }
    if (query?.to) {
      searchParams.set("to", query.to);
    }

    const queryString = searchParams.toString();
    const builtUrl = queryString
      ? `${this.table}/renewals/forecast?${queryString}`
      : `${this.table}/renewals/forecast`;

    return await this.api.doQuery<SubscriptionRenewalForecastDto>(
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

  async processImport(
    file: File,
    override?: boolean,
  ): Promise<ImportPreviewSubscriptionDto[]> {
    const items = await parseJSONFile<SubscriptionDto>(file);
    return await this.api.doQuery<ImportPreviewSubscriptionDto[]>(
      `${this.table}/import/process${override ? `?override=true` : ""}`,
      Methods.POST,
      items,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );
  }

  async import(data: ImportDto<ImportPreviewSubscriptionDto>): Promise<number> {
    return await this.api.post(`${this.table}/import`, data);
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
