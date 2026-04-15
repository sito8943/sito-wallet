import { BaseClient, Methods } from "@sito/dashboard-app";

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

type APIErrorShape = {
  status: number;
  message: string;
};

type RequestConfig = HeadersInit | RequestOptions;

type RequestOptions = {
  headers?: HeadersInit;
  credentials?: RequestCredentials;
};

const isRequestOptions = (
  value: RequestConfig | undefined,
): value is RequestOptions =>
  Boolean(
    value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Headers) &&
      ("headers" in value || "credentials" in value),
  );

const parseErrorMessage = (payload: unknown, fallback: string): string => {
  if (typeof payload === "string") return payload || fallback;

  if (typeof payload === "object" && payload !== null) {
    const maybePayload = payload as { message?: string; error?: string };
    return maybePayload.message ?? maybePayload.error ?? fallback;
  }

  return fallback;
};

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

  async updatePhoto(id: number, file: File): Promise<SubscriptionProviderDto> {
    const formData = new FormData();
    formData.append("file", file);
    const tokenConfig = this.api.defaultTokenAcquirer();
    const requestConfig: RequestOptions = isRequestOptions(tokenConfig)
      ? tokenConfig
      : { headers: tokenConfig };

    const response = await fetch(
      `${config.apiUrl}${this.table}/${id}/photo`,
      {
        method: Methods.PATCH,
        headers: requestConfig.headers,
        credentials: requestConfig.credentials,
        body: formData,
      },
    );

    const payloadText = await response.text();
    let payload: unknown = null;
    let isText = false;

    try {
      payload = payloadText ? JSON.parse(payloadText) : null;
    } catch {
      isText = true;
      payload = payloadText;
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: parseErrorMessage(payload, response.statusText),
      } as APIErrorShape;
    }

    if (response.ok && isText) {
      return { photo: payload as string } as unknown as SubscriptionProviderDto;
    }

    if (!payload || typeof payload !== "object") {
      throw {
        status: response.status,
        message: "Unknown error",
      } as APIErrorShape;
    }

    return payload as SubscriptionProviderDto;
  }

  async deletePhoto(id: number): Promise<SubscriptionProviderDto> {
    return await this.api.doQuery<SubscriptionProviderDto>(
      `${this.table}/${id}/photo`,
      Methods.DELETE,
      undefined,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );
  }
}
