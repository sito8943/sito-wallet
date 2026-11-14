import type { McpAccess, McpArea } from "../../mcp/types";
import type { OAuthGrantDto } from "./OAuthGrantDto";

/** Change of a connected app; the app gets it on its next token refresh. */
export interface OAuthUpdateGrantDto {
  id: OAuthGrantDto["id"];
  access: McpAccess;
  /** null gives the app every area back. */
  areas: McpArea[] | null;
}
