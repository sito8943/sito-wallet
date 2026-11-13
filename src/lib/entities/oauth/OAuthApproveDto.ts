import type { McpAccess } from "../../mcp/types";

/** Body of an approval: the access level the user grants the app. */
export interface OAuthApproveDto {
  access: McpAccess;
}
