/**
 * Pending OAuth authorization request (sito-auth), shown on the consent page.
 * Lives 10 minutes and can be decided only once.
 */
export interface OAuthRequestDto {
  id: string;
  /** Name the client registered itself with (self-declared, unverified). */
  clientName: string;
  clientUri: string | null;
  /** Host the user goes back to after deciding, e.g. "chatgpt.com". */
  redirectHost: string;
  /** Protected resource, e.g. "https://api.wallet.sito8943.com/mcp". */
  resource: string;
  /** Display name of the resource, e.g. "Sito Wallet". */
  resourceName: string;
  scopes: string[];
  /** ISO date-time. */
  expiresAt: string;
}
