import { describe, expect, it } from "vitest";

import { MCP_API_KEY_PLACEHOLDER } from "../constants";
import { McpClient } from "../types";
import { buildMcpSnippet, getMcpUrl, resolveMcpApiKey } from "../utils";

const URL = "https://api.wallet.sito8943.com/mcp";
const KEY = "swal_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQ";

describe("getMcpUrl", () => {
  it.each([
    ["https://api.wallet.sito8943.com/", URL],
    ["https://api.wallet.sito8943.com", URL],
    ["https://api.wallet.sito8943.com//", URL],
    [" https://api.wallet.sito8943.com/ ", URL],
    ["http://localhost:3000/api/", "http://localhost:3000/api/mcp"],
  ])("normalizes %s", (apiUrl, expected) => {
    expect(getMcpUrl(apiUrl)).toBe(expected);
  });
});

describe("resolveMcpApiKey", () => {
  it("uses the given key", () => {
    expect(resolveMcpApiKey(KEY)).toBe(KEY);
  });

  it.each([undefined, null, "", "  "])(
    "falls back to the placeholder for %s",
    (value) => {
      expect(resolveMcpApiKey(value)).toBe(MCP_API_KEY_PLACEHOLDER);
    },
  );
});

describe("buildMcpSnippet", () => {
  it("builds the Claude Code command", () => {
    expect(buildMcpSnippet(McpClient.ClaudeCode, { url: URL, apiKey: KEY }))
      .toBe(`claude mcp add --transport http sito-wallet ${URL} \\
  --header "Authorization: Bearer ${KEY}"`);
  });

  it("builds the Codex config", () => {
    expect(buildMcpSnippet(McpClient.Codex, { url: URL, apiKey: KEY }))
      .toBe(`[mcp_servers.sito-wallet]
url = "${URL}"
http_headers = { Authorization = "Bearer ${KEY}" }`);
  });

  it("builds a valid Claude Desktop config", () => {
    const snippet = buildMcpSnippet(McpClient.ClaudeDesktop, {
      url: URL,
      apiKey: KEY,
    });

    expect(JSON.parse(snippet)).toEqual({
      mcpServers: {
        "sito-wallet": {
          command: "npx",
          args: [
            "-y",
            "mcp-remote",
            URL,
            "--header",
            `Authorization:Bearer ${KEY}`,
          ],
        },
      },
    });
  });

  it("uses the placeholder without a key", () => {
    for (const client of Object.values(McpClient)) {
      const snippet = buildMcpSnippet(client, { url: URL });
      expect(snippet).toContain(`Bearer ${MCP_API_KEY_PLACEHOLDER}`);
    }
  });
});
