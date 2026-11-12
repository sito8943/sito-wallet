import { APIClient, Methods } from "@sito/dashboard-app";

// enum
import { Tables } from "./types";

// config
import { config } from "../../config";

// types
import type { AddApiKeyDto, ApiKeyDto, CreatedApiKeyDto } from "lib";

/** Personal API keys for AI agents (MCP). Only reachable with a session JWT. */
export default class ApiKeyClient {
  table: Tables = Tables.ApiKeys;
  api: APIClient = new APIClient(
    config.apiUrl,
    config.auth.user,
    true,
    undefined,
    config.auth.clientConfig,
  );

  /** Active keys of the current user, newest first. */
  async list(): Promise<ApiKeyDto[]> {
    return await this.api.doQuery<ApiKeyDto[]>(
      this.table,
      Methods.GET,
      undefined,
      this.api.defaultTokenAcquirer(),
    );
  }

  /** Creates a key; the response carries the full secret only this once. */
  async create(data: AddApiKeyDto): Promise<CreatedApiKeyDto> {
    return await this.api.doQuery<CreatedApiKeyDto, AddApiKeyDto>(
      this.table,
      Methods.POST,
      data,
      this.api.defaultTokenAcquirer(),
    );
  }

  /** Revokes a key: it stops working immediately. */
  async revoke(id: number): Promise<void> {
    await this.api.doQuery<void>(
      `${this.table}/${id}`,
      Methods.DELETE,
      undefined,
      this.api.defaultTokenAcquirer(),
    );
  }
}
