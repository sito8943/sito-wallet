/** App the user allowed to access a resource over OAuth (e.g. ChatGPT, claude.ai). */
export interface OAuthGrantDto {
  /** Opaque id (the contract does not fix its type). */
  id: string | number;
  clientName: string;
  /** Protected resource, e.g. "https://api.wallet.sito8943.com/mcp". */
  resource: string;
  resourceName: string;
  scopes: string[];
  /** ISO date-time. */
  createdAt: string;
  /** ISO date-time, null when never used. */
  lastUsedAt: string | null;
}
