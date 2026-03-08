import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../config", () => ({
  config: {
    apiUrl: "https://api.example.com",
    server: {
      probeInterval: 15000,
      statusPath: "/sync/status",
    },
    auth: {
      user: "user",
    },
  },
}));

import {
  probeServerReachability,
  setServerReachable,
  useOnlineStatus,
} from "../useOnlineStatus";

describe("useOnlineStatus", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    setServerReachable(true);
    window.dispatchEvent(new Event("online"));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns false when the backend is unreachable", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Failed to fetch"));

    const { result } = renderHook(() => useOnlineStatus());

    await act(async () => {
      await probeServerReachability();
    });

    await waitFor(() => expect(result.current).toBe(false));
  });

  it("keeps online=true when the server responds with a non-5xx status", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(null, {
        status: 401,
      }),
    );

    const { result } = renderHook(() => useOnlineStatus());

    await act(async () => {
      await probeServerReachability();
    });

    await waitFor(() => expect(result.current).toBe(true));
  });
});
