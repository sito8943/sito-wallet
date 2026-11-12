import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ApiKeyClient from "../ApiKeyClient";

const mockFetch = vi.fn<typeof fetch>();

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const apiKey = {
  id: 3,
  name: "Claude Code laptop",
  prefix: "swal_Ab12Cd",
  createdAt: "2026-11-01T10:00:00Z",
  lastUsedAt: null,
};

describe("ApiKeyClient", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    mockFetch.mockReset();
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("lists the keys", async () => {
    mockFetch.mockResolvedValue(jsonResponse([apiKey]));

    await expect(new ApiKeyClient().list()).resolves.toEqual([apiKey]);
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/api-keys",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("creates a key and returns the full secret", async () => {
    const created = { ...apiKey, key: "swal_secret" };
    mockFetch.mockResolvedValue(jsonResponse(created, 201));

    await expect(
      new ApiKeyClient().create({ name: "Claude Code laptop" }),
    ).resolves.toEqual(created);
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/api-keys",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "Claude Code laptop" }),
      }),
    );
  });

  it("revokes a key with an empty 204 response", async () => {
    mockFetch.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(new ApiKeyClient().revoke(3)).resolves.toBeUndefined();
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/api-keys/3",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("propagates the key limit error", async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ message: "apiKeys.limitReached" }, 400),
    );

    await expect(
      new ApiKeyClient().create({ name: "Eleventh" }),
    ).rejects.toMatchObject({ status: 400, message: "apiKeys.limitReached" });
  });
});
