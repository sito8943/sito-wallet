import { McpClient } from "./types";

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
