import { McpAccess, McpArea, McpClient } from "./types";

/** MCP server name registered in the AI clients. */
export const MCP_SERVER_NAME = "sito-wallet";

/** MCP endpoint path, relative to the API base URL. */
export const MCP_PATH = "mcp";

/** Shown in the snippets when no freshly created key is available. */
export const MCP_API_KEY_PLACEHOLDER = "swal_...";

/** Setup tabs in display order. */
export const MCP_CLIENTS: McpClient[] = [
  McpClient.ClaudeCode,
  McpClient.Codex,
  McpClient.ClaudeDesktop,
];

/** Config file each snippet goes into (null: run it in a terminal). */
export const MCP_CLIENT_CONFIG_FILES: Record<McpClient, string | null> = {
  [McpClient.ClaudeCode]: null,
  [McpClient.Codex]: "~/.codex/config.toml",
  [McpClient.ClaudeDesktop]: "claude_desktop_config.json",
};

/**
 * What a connected agent can do, in display order
 * (`_pages:aiAgents.intro.capabilities.*`). Shared by the AI agents page and
 * the OAuth consent page.
 */
export const MCP_CAPABILITY_KEYS = [
  "read",
  "transactions",
  "transfers",
  "debts",
  "subscriptions",
  "setup",
  "rewards",
] as const;

/** Access level used when the user does not pick one (today's behaviour). */
export const DEFAULT_MCP_ACCESS = McpAccess.Full;

/** Access levels in display order. */
export const MCP_ACCESS_LEVELS: McpAccess[] = [
  McpAccess.Full,
  McpAccess.Read,
  McpAccess.Write,
];

/** Translation key of each level (`_pages:aiAgents.access.levels.*`). */
export const MCP_ACCESS_KEYS: Record<McpAccess, string> = {
  [McpAccess.Full]: "full",
  [McpAccess.Read]: "read",
  [McpAccess.Write]: "write",
};

/** OAuth scope sito-auth adds to a read-only grant. */
export const MCP_READ_ONLY_SCOPE = "mcp:read-only";

/** OAuth scope sito-auth adds to a write-only grant. */
export const MCP_WRITE_ONLY_SCOPE = "mcp:write-only";

/** Areas in display order; a new key gets all of them. */
export const MCP_AREAS: McpArea[] = [
  McpArea.Transactions,
  McpArea.Debts,
  McpArea.Subscriptions,
  McpArea.Accounts,
  McpArea.Categories,
  McpArea.Currencies,
];

/** Translation key of each area (`_pages:aiAgents.areas.items.*`). */
export const MCP_AREA_KEYS: Record<McpArea, string> = {
  [McpArea.Transactions]: "transactions",
  [McpArea.Debts]: "debts",
  [McpArea.Subscriptions]: "subscriptions",
  [McpArea.Accounts]: "accounts",
  [McpArea.Categories]: "categories",
  [McpArea.Currencies]: "currencies",
};
