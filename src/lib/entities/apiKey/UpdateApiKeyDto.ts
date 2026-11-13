import type { McpAccess, McpArea } from "../../mcp/types";

/** Change of an existing key; the secret stays the same. */
export interface UpdateApiKeyDto {
  id: number;
  name: string;
  access: McpAccess;
  areas: McpArea[];
}
