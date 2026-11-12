/** AI clients with setup instructions in the app. */
export enum McpClient {
  ClaudeCode = "claudeCode",
  Codex = "codex",
  ClaudeDesktop = "claudeDesktop",
}

export interface McpSnippetParams {
  /** Full MCP endpoint URL, e.g. "https://api.wallet.sito8943.com/mcp". */
  url: string;
  /** Full API key; a placeholder is used when missing. */
  apiKey?: string | null;
}
