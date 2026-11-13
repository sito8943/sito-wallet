import type { McpAccess, McpArea } from "../../mcp/types";

export interface AddApiKeyDto {
  name: string;
  /** What the key may do; the backend defaults to read and write. */
  access?: McpAccess;
  /** Parts of the wallet the key may use; the backend defaults to all. */
  areas?: McpArea[];
}
