import { describe, expect, it } from "vitest";

import { MCP_API_KEY_PLACEHOLDER, MCP_AREAS } from "../constants";
import { McpAccess, McpArea, McpClient } from "../types";
import {
  buildMcpSnippet,
  filterMcpGrants,
  getMcpAccessFromScopes,
  getMcpUrl,
  hasAllMcpAreas,
  isMcpAccess,
  resolveMcpApiKey,
  toMcpAccess,
  toMcpAreas,
} from "../utils";

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

  it("handles long runs of slashes", () => {
    expect(
      getMcpUrl(`https://api.wallet.sito8943.com${"/".repeat(50_000)}`),
    ).toBe(URL);
    expect(getMcpUrl(`${"/".repeat(50_000)}x`)).toBe(
      `${"/".repeat(50_000)}x/mcp`,
    );
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

describe("filterMcpGrants", () => {
  const grant = (id: number, resource: string) => ({
    id,
    clientName: `App ${id}`,
    resource,
    resourceName: "Sito",
    scopes: ["mcp"],
    createdAt: "2026-11-01T10:00:00Z",
    lastUsedAt: null,
  });

  it("keeps only the grants of this MCP server", () => {
    const grants = [
      grant(1, URL),
      grant(2, "https://api.notes.sito8943.com/mcp"),
      grant(3, `${URL}/`),
      grant(4, "HTTPS://API.WALLET.SITO8943.COM/mcp"),
      grant(5, "https://api.wallet.sito8943.com/mcp-other"),
    ];

    expect(filterMcpGrants(grants, URL).map((g) => g.id)).toEqual([1, 3, 4]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(
      filterMcpGrants([grant(1, "http://localhost:8080/mcp")], URL),
    ).toEqual([]);
  });
});

describe("getMcpAccessFromScopes", () => {
  it.each([
    [["mcp", "mcp:read-only"], McpAccess.Read],
    [["mcp:read-only"], McpAccess.Read],
    [["mcp", "mcp:write-only"], McpAccess.Write],
    [["mcp"], McpAccess.Full],
    [[], McpAccess.Full],
    [["mcp:read"], McpAccess.Full],
    [["MCP:READ-ONLY"], McpAccess.Full],
  ])("maps %j to %s", (scopes, expected) => {
    expect(getMcpAccessFromScopes(scopes)).toBe(expected);
  });

  it("gives read only precedence when both scopes are present", () => {
    expect(getMcpAccessFromScopes(["mcp:write-only", "mcp:read-only"])).toBe(
      McpAccess.Read,
    );
  });

  it.each([undefined, null])("falls back to read and write for %s", (s) => {
    expect(getMcpAccessFromScopes(s)).toBe(McpAccess.Full);
  });
});

describe("isMcpAccess / toMcpAccess", () => {
  it.each(["FULL", "READ", "WRITE"])("accepts %s", (value) => {
    expect(isMcpAccess(value)).toBe(true);
    expect(toMcpAccess(value)).toBe(value);
  });

  it.each(["full", "ADMIN", "", undefined, null, 1, {}])(
    "rejects %j and falls back to read and write",
    (value) => {
      expect(isMcpAccess(value)).toBe(false);
      expect(toMcpAccess(value)).toBe(McpAccess.Full);
    },
  );
});

describe("toMcpAreas", () => {
  it("keeps known areas in display order", () => {
    expect(toMcpAreas([McpArea.Currencies, "GONE", McpArea.Debts])).toEqual([
      McpArea.Debts,
      McpArea.Currencies,
    ]);
  });

  it.each([undefined, null, [], "DEBTS"])(
    "treats %j as every area",
    (value) => {
      expect(toMcpAreas(value)).toEqual(MCP_AREAS);
      expect(hasAllMcpAreas(toMcpAreas(value))).toBe(true);
    },
  );
});
