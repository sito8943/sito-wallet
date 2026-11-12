import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import OAuthClient from "../OAuthClient";
import { config } from "../../../config";

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

  it.each([
    ["approve", "https://chatgpt.com/cb?code=x&state=s"],
    ["deny", "https://chatgpt.com/cb?error=access_denied&state=s"],
  ] as const)("posts %s without a body", async (action, redirectUrl) => {
    mockFetch.mockResolvedValue(jsonResponse({ redirectUrl }));

    await expect(new OAuthClient()[action]("req_1")).resolves.toEqual({
      redirectUrl,
    });
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe(`${AUTH}/oauth/requests/req_1/${action}`);
    expect(init).toMatchObject({ method: "POST" });
    expect(init?.body).toBeUndefined();
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
