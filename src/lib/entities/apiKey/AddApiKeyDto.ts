import type { McpAccess } from "../../mcp/types";

export interface AddApiKeyDto {
  name: string;
  /** What the key may do; the backend defaults to read and write. */
  access?: McpAccess;
}
