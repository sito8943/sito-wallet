import {
  MCP_API_KEY_PLACEHOLDER,
  MCP_PATH,
  MCP_SERVER_NAME,
} from "./constants";
import { McpClient, type McpSnippetParams } from "./types";

/**
 * MCP endpoint for an API base URL, with or without a trailing slash:
 * "https://api.example.com/" and "https://api.example.com" both give
 * "https://api.example.com/mcp".
 */
export const getMcpUrl = (apiUrl: string): string =>
  `${apiUrl.trim().replace(/\/+$/, "")}/${MCP_PATH}`;

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
