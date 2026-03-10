import { render } from "@testing-library/react";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockLogoutUser = vi.fn(() => Promise.resolve());
const mockClearIndexedDatabases = vi.fn(() => Promise.resolve());
const mockClearFeatures = vi.fn();
const mockClearPersistedPublicSessionAccount = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@sito/dashboard-app", () => ({
  SplashScreen: () => <div data-testid="splash-screen" />,
  useAuth: () => ({
    logoutUser: mockLogoutUser,
  }),
}));

vi.mock("providers", () => ({
  useOfflineManager: () => ({
    clearIndexedDatabases: mockClearIndexedDatabases,
  }),
  useFeatureFlags: () => ({
    clearFeatures: mockClearFeatures,
  }),
}));

vi.mock("lib", () => ({
  clearPersistedPublicSessionAccount: () =>
    mockClearPersistedPublicSessionAccount(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

import { SignOut } from "./SignOut";

describe("SignOut", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockLogoutUser.mockReset();
    mockClearIndexedDatabases.mockReset();
    mockClearFeatures.mockReset();
    mockClearPersistedPublicSessionAccount.mockReset();
    mockNavigate.mockReset();
  });

  it("clears local snapshot and indexed databases before navigating to sign-in", async () => {
    render(<SignOut />);

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mockClearPersistedPublicSessionAccount).toHaveBeenCalled();
    expect(mockClearFeatures).toHaveBeenCalled();
    expect(mockClearIndexedDatabases).toHaveBeenCalled();
    expect(mockLogoutUser).toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/auth/sign-in");
  });
});
