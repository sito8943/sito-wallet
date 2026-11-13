import type { McpAccess, McpArea } from "../../mcp/types";

/** Body of an approval: the access level and areas the user grants the app. */
export interface OAuthApproveDto {
  access: McpAccess;
  /** Omitted (or null) for every area. */
  areas?: McpArea[] | null;
}
