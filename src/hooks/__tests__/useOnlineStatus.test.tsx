import { useSyncExternalStore } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type MockOnlineStatusSnapshot = {
  isBrowserOnline: boolean;
  isServerReachable: boolean;
  isOnline: boolean;
};

const listeners = new Set<() => void>();

let snapshot: MockOnlineStatusSnapshot = {
  isBrowserOnline: true,
  isServerReachable: true,
  isOnline: true,
};

const emitSnapshot = () => {
  listeners.forEach((listener) => listener());
};

const updateSnapshot = (
  nextValues: Partial<MockOnlineStatusSnapshot>,
): void => {
  snapshot = {
    isBrowserOnline: nextValues.isBrowserOnline ?? snapshot.isBrowserOnline,
    isServerReachable:
      nextValues.isServerReachable ?? snapshot.isServerReachable,
    isOnline: false,
  };
  snapshot.isOnline = snapshot.isBrowserOnline && snapshot.isServerReachable;
  emitSnapshot();
};

vi.mock("@sito/dashboard-app", () => ({
  setServerReachable: (value: boolean) => {
    updateSnapshot({ isServerReachable: value });
  },
  useOnlineStatusSnapshot: () =>
    useSyncExternalStore(
      (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      () => snapshot,
      () => snapshot,
    ),
  probeServerReachability: async (options: {
    probeUrl: string;
    probeMethod?: string;
    probeRequestInit?: () => RequestInit;
    resolveIsServerReachable: (response: Response) => boolean;
  }) => {
    updateSnapshot({ isBrowserOnline: navigator.onLine });

    try {
      const response = await fetch(options.probeUrl, {
        method: options.probeMethod ?? "GET",
        ...options.probeRequestInit?.(),
      });
      const isServerReachable = options.resolveIsServerReachable(response);
      updateSnapshot({
        isBrowserOnline: true,
        isServerReachable,
      });
      return isServerReachable;
    } catch {
      updateSnapshot({
        isBrowserOnline: true,
        isServerReachable: false,
      });
      return false;
    }
  },
}));

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
    snapshot = {
      isBrowserOnline: true,
      isServerReachable: true,
      isOnline: true,
    };
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
