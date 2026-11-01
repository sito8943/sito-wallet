import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SESSION_BOOTSTRAP_TIMEOUT_MS } from "../useAppSession/constants";

const mocks = vi.hoisted(() => ({
  logUser: vi.fn(),
  logoutUser: vi.fn(),
  clearFeatures: vi.fn(),
  getSession: vi.fn(),
  storedSession: null as { id: number } | null,
}));

vi.mock("@sito/dashboard-app", () => ({
  isHttpError: () => false,
  useAuth: () => ({ logUser: mocks.logUser, logoutUser: mocks.logoutUser }),
}));

vi.mock("providers", () => ({
  useFeatureFlags: () => ({ clearFeatures: mocks.clearFeatures }),
  useManager: () => ({ Auth: { getSession: mocks.getSession } }),
}));

vi.mock("lib", () => ({
  clearPersistedPublicSessionAccount: vi.fn(),
  readStoredRememberMe: () => true,
  readStoredSessionFromSnapshot: () => mocks.storedSession,
}));

vi.mock("../useOnlineStatus", () => ({ useOnlineStatus: () => true }));

const { useAppSession } = await import("../useAppSession");

describe("useAppSession", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mocks.storedSession = null;
    // A request that never answers.
    mocks.getSession.mockReturnValue(new Promise(() => {}));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("stops waiting for a hung session check", async () => {
    const { result } = renderHook(() => useAppSession());
    expect(result.current).toBe(true);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SESSION_BOOTSTRAP_TIMEOUT_MS + 300);
    });

    expect(result.current).toBe(false);
    expect(mocks.logUser).not.toHaveBeenCalled();
  });

  it("keeps the stored session when the check hangs", async () => {
    mocks.storedSession = { id: 7 };
    const { result } = renderHook(() => useAppSession());

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SESSION_BOOTSTRAP_TIMEOUT_MS + 300);
    });

    expect(result.current).toBe(false);
    expect(mocks.logUser).toHaveBeenCalledWith({ id: 7 }, true);
  });

  it("does not wait for the timeout when the check answers", async () => {
    mocks.getSession.mockResolvedValue({ id: 1 });
    const { result } = renderHook(() => useAppSession());

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(result.current).toBe(false);
    expect(mocks.logUser).toHaveBeenCalledWith({ id: 1 }, true);
  });
});
