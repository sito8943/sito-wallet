import { APIClient, Methods } from "@sito/dashboard-app";

import { config } from "../../../config";
import {
  SyncBulkRequest,
  SyncBulkResponse,
  SyncCancelSessionRequest,
  SyncCancelSessionResponse,
  SyncEntity,
  SyncFinishSessionRequest,
  SyncFinishSessionResponse,
  SyncStartSessionRequest,
  SyncStartSessionResponse,
  SyncStatusResponse,
} from "./types";

const SYNC_BASE_PATH = "/sync";

type RequestOptions = {
  headers?: HeadersInit;
  credentials?: RequestCredentials;
};

export class SyncClient {
  private readonly api: APIClient = new APIClient(
    config.apiUrl,
    config.auth.user,
    true,
    undefined,
    {
      rememberKey: config.auth.remember,
      refreshTokenKey: config.auth.refreshTokenKey,
      accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
    }
  );

  private get requestConfig(): RequestOptions | HeadersInit {
    return this.api.defaultTokenAcquirer() ?? {};
  }

  async status(): Promise<SyncStatusResponse> {
    return await this.api.doQuery<SyncStatusResponse>(
      `${SYNC_BASE_PATH}/status`,
      Methods.GET,
      undefined,
      this.requestConfig
    );
  }

  async startSession(
    data: SyncStartSessionRequest
  ): Promise<SyncStartSessionResponse> {
    return await this.api.doQuery<SyncStartSessionResponse>(
      `${SYNC_BASE_PATH}/session/start`,
      Methods.POST,
      data,
      this.requestConfig
    );
  }

  async sendBulk(
    entity: SyncEntity,
    data: SyncBulkRequest
  ): Promise<SyncBulkResponse> {
    return await this.api.doQuery<SyncBulkResponse>(
      `${SYNC_BASE_PATH}/bulk/${entity}`,
      Methods.POST,
      data,
      this.requestConfig
    );
  }

  async finishSession(
    data: SyncFinishSessionRequest
  ): Promise<SyncFinishSessionResponse> {
    return await this.api.doQuery<SyncFinishSessionResponse>(
      `${SYNC_BASE_PATH}/session/finish`,
      Methods.POST,
      data,
      this.requestConfig
    );
  }

  async cancelSession(
    data: SyncCancelSessionRequest
  ): Promise<SyncCancelSessionResponse> {
    return await this.api.doQuery<SyncCancelSessionResponse>(
      `${SYNC_BASE_PATH}/session/cancel`,
      Methods.POST,
      data,
      this.requestConfig
    );
  }
}

export const syncClient = new SyncClient();
