import {
  DEFAULT_MCP_ACCESS,
  MCP_API_KEY_PLACEHOLDER,
  MCP_AREAS,
  MCP_AREA_SCOPE_PREFIX,
  MCP_PATH,
  MCP_READ_ONLY_SCOPE,
  MCP_SERVER_NAME,
  MCP_WRITE_ONLY_SCOPE,
} from "./constants";
import { McpAccess, McpArea, McpClient, type McpSnippetParams } from "./types";

// types
import type { OAuthGrantDto } from "../entities/oauth";

/** Drops trailing "/" without a regex (`/\/+$/` backtracks on long runs of "/"). */
const trimTrailingSlashes = (value: string): string => {
  let end = value.length;
  while (end > 0 && value[end - 1] === "/") end--;
  return value.slice(0, end);
};

/**
 * MCP endpoint for an API base URL, with or without a trailing slash:
 * "https://api.example.com/" and "https://api.example.com" both give
 * "https://api.example.com/mcp".
 */
export const getMcpUrl = (apiUrl: string): string =>
  `${trimTrailingSlashes(apiUrl.trim())}/${MCP_PATH}`;

const normalizeResourceUrl = (url: string): string =>
  trimTrailingSlashes(url.trim()).toLowerCase();

/**
 * Grants for this wallet's MCP server only (sito-auth lists the grants of
 * every app). Trailing slashes and letter case are ignored.
 */
export const filterMcpGrants = (
  grants: OAuthGrantDto[],
  mcpUrl: string,
): OAuthGrantDto[] => {
  const target = normalizeResourceUrl(mcpUrl);
  return grants.filter(
    (grant) => normalizeResourceUrl(grant.resource) === target,
  );
};

const MCP_ACCESS_VALUES: readonly string[] = Object.values(McpAccess);

/** True when `value` is a known access level. */
export const isMcpAccess = (value: unknown): value is McpAccess =>
  typeof value === "string" && MCP_ACCESS_VALUES.includes(value);

/**
 * Access level of external data (e.g. an API key from the backend); unknown or
 * missing values fall back to the default (read and write).
 */
export const toMcpAccess = (value: unknown): McpAccess =>
  isMcpAccess(value) ? value : DEFAULT_MCP_ACCESS;

const MCP_AREA_VALUES: readonly string[] = Object.values(McpArea);

/** True when `value` is a known area. */
export const isMcpArea = (value: unknown): value is McpArea =>
  typeof value === "string" && MCP_AREA_VALUES.includes(value);

/**
 * Areas of external data (e.g. an API key from the backend), in display
 * order. Unknown values are dropped; a missing or empty list means all areas
 * (keys created before areas existed).
 */
export const toMcpAreas = (value: unknown): McpArea[] => {
  const known = Array.isArray(value) ? value.filter(isMcpArea) : [];
  if (!known.length) return [...MCP_AREAS];
  return MCP_AREAS.filter((area) => known.includes(area));
};

/** True when `areas` covers every area (an unrestricted key). */
export const hasAllMcpAreas = (areas: readonly McpArea[]): boolean =>
  MCP_AREAS.every((area) => areas.includes(area));

/**
 * Areas of an OAuth grant, from its `mcp:area:<name>` scopes. No area scope
 * means every area; area scopes naming none we know mean no area (like the
 * backend).
 */
export const getMcpAreasFromScopes = (
  scopes: readonly string[] | null | undefined,
): McpArea[] => {
  const names = (scopes ?? [])
    .filter((scope) => scope.startsWith(MCP_AREA_SCOPE_PREFIX))
    .map((scope) => scope.slice(MCP_AREA_SCOPE_PREFIX.length));
  if (!names.length) return [...MCP_AREAS];
  return MCP_AREAS.filter((area) => names.includes(area.toLowerCase()));
};

/** Areas to send to sito-auth: null when every area is picked (no limit). */
export const toMcpAreasPayload = (
  areas: readonly McpArea[],
): McpArea[] | null => (hasAllMcpAreas(areas) ? null : [...areas]);

/**
 * Access level of an OAuth grant, from its scopes: `mcp:read-only` gives
 * read only, `mcp:write-only` gives write only, anything else read and write.
 */
export const getMcpAccessFromScopes = (
  scopes: readonly string[] | null | undefined,
): McpAccess => {
  if (!scopes) return DEFAULT_MCP_ACCESS;
  if (scopes.includes(MCP_READ_ONLY_SCOPE)) return McpAccess.Read;
  if (scopes.includes(MCP_WRITE_ONLY_SCOPE)) return McpAccess.Write;
  return DEFAULT_MCP_ACCESS;
};

/** Key to print in a snippet: the given one, or the placeholder. */
export const resolveMcpApiKey = (apiKey?: string | null): string =>
  apiKey?.trim() || MCP_API_KEY_PLACEHOLDER;

const buildClaudeCodeSnippet = (url: string, apiKey: string): string =>
  [
    `claude mcp add --transport http ${MCP_SERVER_NAME} ${url} \\`,
    `  --header "Authorization: Bearer ${apiKey}"`,
  ].join("\n");

const buildCodexSnippet = (url: string, apiKey: string): string =>
  [
    `[mcp_servers.${MCP_SERVER_NAME}]`,
    `url = "${url}"`,
    `http_headers = { Authorization = "Bearer ${apiKey}" }`,
  ].join("\n");

const buildClaudeDesktopSnippet = (url: string, apiKey: string): string =>
  JSON.stringify(
    {
      mcpServers: {
        [MCP_SERVER_NAME]: {
          command: "npx",
          args: [
            "-y",
            "mcp-remote",
            url,
            "--header",
            `Authorization:Bearer ${apiKey}`,
          ],
        },
      },
    },
    null,
    2,
  );

/** Ready-to-paste setup snippet of an AI client. */
export const buildMcpSnippet = (
  client: McpClient,
  { url, apiKey }: McpSnippetParams,
): string => {
  const key = resolveMcpApiKey(apiKey);

  switch (client) {
    case McpClient.ClaudeCode:
      return buildClaudeCodeSnippet(url, key);
    case McpClient.Codex:
      return buildCodexSnippet(url, key);
    case McpClient.ClaudeDesktop:
      return buildClaudeDesktopSnippet(url, key);
  }
};
