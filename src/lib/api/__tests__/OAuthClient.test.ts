import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import OAuthClient from "../OAuthClient";
import { config } from "../../../config";
import { McpAccess } from "../../mcp/types";

const mockFetch = vi.fn<typeof fetch>();

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// sito-auth base URL (VITE_AUTH_URL, or the API URL when unset).
const AUTH = config.authUrl.replace(/\/+$/, "");

const request = {
  id: "req_1",
  clientName: "ChatGPT",
  clientUri: null,
  redirectHost: "chatgpt.com",
  resource: "http://localhost:8080/mcp",
  resourceName: "Sito Wallet",
  scopes: ["mcp"],
  expiresAt: "2026-11-12T10:10:00Z",
};

describe("OAuthClient", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    mockFetch.mockReset();
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads an authorization request from sito-auth", async () => {
    mockFetch.mockResolvedValue(jsonResponse(request));

    await expect(new OAuthClient().getRequest("req_1")).resolves.toEqual(
      request,
    );
    expect(mockFetch).toHaveBeenCalledWith(
      `${AUTH}/oauth/requests/req_1`,
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("escapes the request id", async () => {
    mockFetch.mockResolvedValue(jsonResponse(request));

    await new OAuthClient().getRequest("a/b?c");
    expect(mockFetch).toHaveBeenCalledWith(
      `${AUTH}/oauth/requests/a%2Fb%3Fc`,
      expect.anything(),
    );
  });

  it("posts deny without a body", async () => {
    const redirectUrl = "https://chatgpt.com/cb?error=access_denied&state=s";
    mockFetch.mockResolvedValue(jsonResponse({ redirectUrl }));

    await expect(new OAuthClient().deny("req_1")).resolves.toEqual({
      redirectUrl,
    });
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe(`${AUTH}/oauth/requests/req_1/deny`);
    expect(init).toMatchObject({ method: "POST" });
    expect(init?.body).toBeUndefined();
  });

  it.each([
    [undefined, McpAccess.Full],
    [McpAccess.Full, McpAccess.Full],
    [McpAccess.Read, McpAccess.Read],
    [McpAccess.Write, McpAccess.Write],
  ])("posts approve with access %s", async (access, expected) => {
    const redirectUrl = "https://chatgpt.com/cb?code=x&state=s";
    mockFetch.mockResolvedValue(jsonResponse({ redirectUrl }));

    await expect(new OAuthClient().approve("req_1", access)).resolves.toEqual({
      redirectUrl,
    });
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe(`${AUTH}/oauth/requests/req_1/approve`);
    expect(init).toMatchObject({ method: "POST" });
    expect(JSON.parse(String(init?.body))).toEqual({ access: expected });
  });

  it("propagates 404 for an expired request", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ message: "not found" }, 404));

    await expect(new OAuthClient().getRequest("old")).rejects.toMatchObject({
      status: 404,
    });
  });

  it("lists and revokes grants", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse([]));
    mockFetch.mockResolvedValueOnce(new Response(null, { status: 204 }));

    const client = new OAuthClient();
    await expect(client.listGrants()).resolves.toEqual([]);
    await expect(client.revokeGrant(9)).resolves.toBeUndefined();

    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      `${AUTH}/oauth/grants`,
      expect.objectContaining({ method: "GET" }),
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      `${AUTH}/oauth/grants/9`,
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
