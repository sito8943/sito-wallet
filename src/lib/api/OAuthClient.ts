import { APIClient, Methods } from "@sito/dashboard-app";

// enum
import { OAuthEndpoints } from "./types";

// config
import { config } from "../../config";

// types
import type {
  OAuthApproveDto,
  OAuthDecisionDto,
  OAuthGrantDto,
  OAuthRequestDto,
} from "lib";

// mcp
import { DEFAULT_MCP_ACCESS } from "../mcp/constants";
import type { McpAccess } from "../mcp/types";

/**
 * OAuth consent and connected apps (sito-auth). Uses the normal session
 * token, refreshed on sito-auth like every other client.
 */
export default class OAuthClient {
  api: APIClient = new APIClient(
    config.authUrl,
    config.auth.user,
    true,
    undefined,
    config.auth.clientConfig,
  );

  /** Pending authorization request; 404 when unknown, expired or used. */
  async getRequest(id: string): Promise<OAuthRequestDto> {
    return await this.api.doQuery<OAuthRequestDto>(
      `${OAuthEndpoints.Requests}/${encodeURIComponent(id)}`,
      Methods.GET,
      undefined,
      this.api.defaultTokenAcquirer(),
    );
  }

  /**
   * Allows the request with an access level (read and write by default); the
   * redirect URL carries the authorization code.
   */
  async approve(
    id: string,
    access: McpAccess = DEFAULT_MCP_ACCESS,
  ): Promise<OAuthDecisionDto> {
    return await this.decide<OAuthApproveDto>(id, "approve", { access });
  }

  /** Denies the request; the redirect URL carries `error=access_denied`. */
  async deny(id: string): Promise<OAuthDecisionDto> {
    return await this.decide(id, "deny");
  }

  /** Active grants of the current user, newest first (every resource). */
  async listGrants(): Promise<OAuthGrantDto[]> {
    return await this.api.doQuery<OAuthGrantDto[]>(
      OAuthEndpoints.Grants,
      Methods.GET,
      undefined,
      this.api.defaultTokenAcquirer(),
    );
  }

  /** Revokes a grant: the app can no longer refresh its tokens. */
  async revokeGrant(id: OAuthGrantDto["id"]): Promise<void> {
    await this.api.doQuery<void>(
      `${OAuthEndpoints.Grants}/${encodeURIComponent(String(id))}`,
      Methods.DELETE,
      undefined,
      this.api.defaultTokenAcquirer(),
    );
  }

  private async decide<TBody = undefined>(
    id: string,
    action: "approve" | "deny",
    body?: TBody,
  ): Promise<OAuthDecisionDto> {
    return await this.api.doQuery<OAuthDecisionDto, TBody>(
      `${OAuthEndpoints.Requests}/${encodeURIComponent(id)}/${action}`,
      Methods.POST,
      body,
      this.api.defaultTokenAcquirer(),
    );
  }
}
