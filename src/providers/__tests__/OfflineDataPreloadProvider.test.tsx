import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPreloadOfflineBootstrapData = vi.fn(() => Promise.resolve());
const mockUseAuth = vi.fn();
const mockUseOnlineStatus = vi.fn();

const mockManager = {
  Accounts: {},
  Currencies: {},
  TransactionCategories: {},
};

const mockOfflineManager = {
  Accounts: {},
  Currencies: {},
  TransactionCategories: {},
};

vi.mock("@sito/dashboard-app", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("hooks", () => ({
  useOnlineStatus: () => mockUseOnlineStatus(),
}));

vi.mock("lib", () => ({
  preloadOfflineBootstrapData: (
    ...args: Parameters<typeof mockPreloadOfflineBootstrapData>
  ) => mockPreloadOfflineBootstrapData(...args),
}));

vi.mock("../useSWManager", () => ({
  useManager: () => mockManager,
}));

vi.mock("../OfflineManagerContext", () => ({
  useOfflineManager: () => mockOfflineManager,
}));

import { OfflineDataPreloadProvider } from "../OfflineDataPreloadProvider";

describe("OfflineDataPreloadProvider", () => {
  beforeEach(() => {
    mockPreloadOfflineBootstrapData.mockClear();
    mockUseOnlineStatus.mockReturnValue(true);
    mockUseAuth.mockReturnValue({
      account: { id: 1, email: "test@example.com" },
      isInGuestMode: () => false,
    });
  });

  it("preloads offline data for authenticated online users", async () => {
    render(
      <OfflineDataPreloadProvider>
        <div>content</div>
      </OfflineDataPreloadProvider>,
    );

    expect(screen.getByText("content")).toBeInTheDocument();

    await waitFor(() =>
      expect(mockPreloadOfflineBootstrapData).toHaveBeenCalledWith(
        mockManager,
        mockOfflineManager,
      ),
    );
  });

  it("does not preload while offline", async () => {
    mockUseOnlineStatus.mockReturnValue(false);

    render(
      <OfflineDataPreloadProvider>
        <div>content</div>
      </OfflineDataPreloadProvider>,
    );

    await waitFor(() =>
      expect(mockPreloadOfflineBootstrapData).not.toHaveBeenCalled(),
    );
  });

  it("does not preload in guest mode", async () => {
    mockUseAuth.mockReturnValue({
      account: { id: 1, email: "test@example.com" },
      isInGuestMode: () => true,
    });

    render(
      <OfflineDataPreloadProvider>
        <div>content</div>
      </OfflineDataPreloadProvider>,
    );

    await waitFor(() =>
      expect(mockPreloadOfflineBootstrapData).not.toHaveBeenCalled(),
    );
  });
});
