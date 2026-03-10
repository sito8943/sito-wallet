import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockLogUser = vi.fn();
const mockLogoutUser = vi.fn(() => Promise.resolve());
const mockGetSession = vi.fn();
const mockClearIndexedDatabases = vi.fn(() => Promise.resolve());
const mockClearFeatures = vi.fn();
const mockUseOnlineStatus = vi.fn();
const mockReadStoredSessionFromSnapshot = vi.fn();
const mockReadStoredRememberMe = vi.fn();
const mockClearPersistedPublicSessionAccount = vi.fn();

vi.mock("@sito/dashboard-app", () => ({
  SplashScreen: () => <div data-testid="splash-screen" />,
  useAuth: () => ({
    logUser: mockLogUser,
    logoutUser: mockLogoutUser,
  }),
  isHttpError: (error: unknown) =>
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number",
}));

vi.mock("./hooks/useOnlineStatus", () => ({
  useOnlineStatus: () => mockUseOnlineStatus(),
}));

vi.mock("providers", () => ({
  useManager: () => ({
    Auth: {
      getSession: mockGetSession,
    },
  }),
  useOfflineManager: () => ({
    clearIndexedDatabases: mockClearIndexedDatabases,
  }),
  useFeatureFlags: () => ({
    clearFeatures: mockClearFeatures,
  }),
}));

vi.mock("./Routes", () => ({
  Routes: () => <div data-testid="routes" />,
}));

vi.mock("lib", () => ({
  readStoredSessionFromSnapshot: () => mockReadStoredSessionFromSnapshot(),
  readStoredRememberMe: () => mockReadStoredRememberMe(),
  clearPersistedPublicSessionAccount: () =>
    mockClearPersistedPublicSessionAccount(),
}));

import App from "./App";

describe("App auth bootstrap", () => {
  beforeEach(() => {
    vi.useRealTimers();
    mockLogUser.mockReset();
    mockLogoutUser.mockReset();
    mockGetSession.mockReset();
    mockClearIndexedDatabases.mockReset();
    mockClearFeatures.mockReset();
    mockUseOnlineStatus.mockReset();
    mockReadStoredSessionFromSnapshot.mockReset();
    mockReadStoredRememberMe.mockReset();
    mockClearPersistedPublicSessionAccount.mockReset();
  });

  it("rehydrates the stored session when booting offline", async () => {
    const storedSession = {
      id: 1,
      username: "sito",
      email: "sito@example.com",
      token: "token",
      refreshToken: "refresh",
      accessTokenExpiresAt: "2026-03-08T22:00:00.000Z",
    };

    mockUseOnlineStatus.mockReturnValue(false);
    mockReadStoredSessionFromSnapshot.mockReturnValue(storedSession);
    mockReadStoredRememberMe.mockReturnValue(true);

    render(<App />);

    await waitFor(() =>
      expect(mockLogUser).toHaveBeenCalledWith(storedSession, true),
    );

    expect(mockGetSession).not.toHaveBeenCalled();

    expect(await screen.findByTestId("routes")).toBeInTheDocument();
  });

  it("clears persisted account data and logs out on unauthorized session restore", async () => {
    mockUseOnlineStatus.mockReturnValue(true);
    mockReadStoredSessionFromSnapshot.mockReturnValue(null);
    mockReadStoredRememberMe.mockReturnValue(false);
    mockGetSession.mockRejectedValue({ status: 401, message: "Unauthorized" });

    render(<App />);

    await waitFor(() => expect(mockLogoutUser).toHaveBeenCalled());
    expect(mockClearPersistedPublicSessionAccount).toHaveBeenCalled();
    expect(mockClearFeatures).toHaveBeenCalled();
    expect(mockClearIndexedDatabases).toHaveBeenCalled();

    expect(await screen.findByTestId("routes")).toBeInTheDocument();
  });

  it("finishes bootstrapping when the online status changes during session restore", async () => {
    vi.useFakeTimers();

    let isOnline = true;
    let rejectSessionRestore:
      | ((error: { status: number; message: string }) => void)
      | undefined;

    mockUseOnlineStatus.mockImplementation(() => isOnline);
    mockReadStoredSessionFromSnapshot.mockReturnValue(null);
    mockReadStoredRememberMe.mockReturnValue(false);
    mockGetSession.mockReturnValue(
      new Promise((_, reject: (error: { status: number; message: string }) => void) => {
        rejectSessionRestore = reject;
      }),
    );

    const { rerender } = render(<App />);

    isOnline = false;
    rerender(<App />);

    await act(async () => {
      rejectSessionRestore?.({ status: 500, message: "Failed to fetch" });
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mockLogoutUser).toHaveBeenCalled();
    expect(mockClearFeatures).toHaveBeenCalled();
    expect(mockClearIndexedDatabases).toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(screen.getByTestId("routes")).toBeInTheDocument();
  });
});
