import { render } from "@testing-library/react";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockLogoutUser = vi.fn(() => Promise.resolve());
const mockClearFeatures = vi.fn();
const mockClearPersistedPublicSessionAccount = vi.fn();
const mockClearPersistedQueryCache = vi.fn();
const mockQueryClientClear = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@sito/dashboard-app", () => ({
  SplashScreen: () => <div data-testid="splash-screen" />,
  useAuth: () => ({
    logoutUser: mockLogoutUser,
  }),
}));

vi.mock("providers", () => ({
  useFeatureFlags: () => ({
    clearFeatures: mockClearFeatures,
  }),
  clearPersistedQueryCache: () => mockClearPersistedQueryCache(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ clear: mockQueryClientClear }),
}));

const mockClearAllTableOptions = vi.fn();

vi.mock("lib", () => ({
  AppRoutes: {
    signIn: "/auth/sign-in",
  },
  clearPersistedPublicSessionAccount: () =>
    mockClearPersistedPublicSessionAccount(),
  clearAllTableOptions: () => mockClearAllTableOptions(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

import { SignOut } from "./SignOut";

describe("SignOut", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockLogoutUser.mockReset();
    mockClearFeatures.mockReset();
    mockClearPersistedPublicSessionAccount.mockReset();
    mockClearPersistedQueryCache.mockReset();
    mockQueryClientClear.mockReset();
    mockClearAllTableOptions.mockReset();
    mockNavigate.mockReset();
  });

  it("clears local snapshot before navigating to sign-in", async () => {
    render(<SignOut />);

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mockClearPersistedPublicSessionAccount).toHaveBeenCalled();
    expect(mockClearAllTableOptions).toHaveBeenCalled();
    expect(mockClearFeatures).toHaveBeenCalled();
    expect(mockQueryClientClear).toHaveBeenCalled();
    expect(mockClearPersistedQueryCache).toHaveBeenCalled();
    expect(mockLogoutUser).toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/auth/sign-in");
  });
});
