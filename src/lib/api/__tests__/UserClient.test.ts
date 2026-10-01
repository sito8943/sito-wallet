import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import UserClient from "../UserClient";

const mockFetch = vi.fn<typeof fetch>();

describe("UserClient", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    mockFetch.mockReset();
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([200, 204])("accepts an empty HTTP %s reset response", async (status) => {
    mockFetch.mockResolvedValue(new Response(null, { status }));

    const client = new UserClient();
    await expect(client.reset(42, true)).resolves.toBeUndefined();

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/users/42/reset",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ hard: true }),
      }),
    );
  });

  it("propagates reset errors to the caller", async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ message: "reset failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = new UserClient();

    await expect(client.reset(7, false)).rejects.toMatchObject({
      status: 500,
      message: "reset failed",
    });
  });
});
