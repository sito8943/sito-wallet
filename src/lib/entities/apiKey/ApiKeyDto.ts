/** Personal API key used by AI agents to reach the MCP endpoint. */
export interface ApiKeyDto {
  id: number;
  /** User label (1..60 chars), e.g. "Claude Code laptop". */
  name: string;
  /** Visible part of the key, e.g. "swal_Ab12Cd". */
  prefix: string;
  /** ISO date-time. */
  createdAt: string;
  /** ISO date-time, null when the key was never used. */
  lastUsedAt: string | null;
}
