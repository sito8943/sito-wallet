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

/**
 * What a connected agent (API key or OAuth app) may do with the wallet.
 * Values are the backend/sito-auth contract.
 */
export enum McpAccess {
  /** Read and write (default). */
  Full = "FULL",
  /** Read only: no changes. */
  Read = "READ",
  /** Write only: can add/change data but not browse history, balances or summaries. */
  Write = "WRITE",
}

/**
 * Parts of the wallet an API key may use, on top of its access level.
 * Values are the backend contract.
 */
export enum McpArea {
  Transactions = "TRANSACTIONS",
  Debts = "DEBTS",
  Subscriptions = "SUBSCRIPTIONS",
  Accounts = "ACCOUNTS",
  Categories = "CATEGORIES",
  Currencies = "CURRENCIES",
}
