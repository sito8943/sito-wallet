import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

const {
  mockRevokeGrant,
  mockShowSuccessNotification,
  mockHandleMutationError,
} = vi.hoisted(() => ({
  mockRevokeGrant: vi.fn(),
  mockShowSuccessNotification: vi.fn(),
  mockHandleMutationError: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts?.name ? `${key} ${String(opts.name)}` : key,
  }),
}));

vi.mock("@sito/dashboard-app", () => ({
  useNotification: () => ({
    showSuccessNotification: mockShowSuccessNotification,
  }),
}));

vi.mock("providers", () => ({
  useManager: () => ({ OAuth: { revokeGrant: mockRevokeGrant } }),
}));

vi.mock("hooks", () => ({
  OAuthQueryKeys: { grants: () => ({ queryKey: ["oauth", "grants"] }) },
  useMutationErrorHandler: () => mockHandleMutationError,
}));

import { useDisconnectAppDialog } from "../hooks/useDisconnectAppDialog";

const grant = {
  id: 11,
  clientName: "ChatGPT",
  resource: "https://api.wallet.sito8943.com/mcp",
  resourceName: "Sito Wallet",
  scopes: ["mcp"],
  createdAt: "2026-11-01T10:00:00Z",
  lastUsedAt: null,
};

const setup = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const hook = renderHook(() => useDisconnectAppDialog(), { wrapper });
  return { ...hook, invalidateSpy };
};

describe("useDisconnectAppDialog", () => {
  beforeEach(() => {
    mockRevokeGrant.mockReset();
    mockHandleMutationError.mockReset();
  });

  it("asks for confirmation, then revokes the grant", async () => {
    mockRevokeGrant.mockResolvedValue(undefined);
    const { result, invalidateSpy } = setup();

    act(() => result.current.openForGrant(grant));
    expect(result.current.open).toBe(true);
    expect(result.current.title).toBe(
      "_pages:aiAgents.apps.disconnect.title ChatGPT",
    );
    expect(mockRevokeGrant).not.toHaveBeenCalled();

    act(() => result.current.handleSubmit());

    await waitFor(() => expect(result.current.open).toBe(false));
    expect(mockRevokeGrant).toHaveBeenCalledWith(11);
    expect(mockShowSuccessNotification).toHaveBeenCalledWith({
      message: "_pages:aiAgents.apps.disconnect.successMessage",
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["oauth", "grants"],
    });
  });

  it("closes without revoking when cancelled", () => {
    const { result } = setup();

    act(() => result.current.openForGrant(grant));
    act(() => result.current.handleClose());

    expect(result.current.open).toBe(false);
    expect(mockRevokeGrant).not.toHaveBeenCalled();
  });

  it("reports errors and keeps the dialog open", async () => {
    const error = { status: 404, message: "Not found" };
    mockRevokeGrant.mockRejectedValue(error);
    const { result } = setup();

    act(() => result.current.openForGrant(grant));
    act(() => result.current.handleSubmit());

    await waitFor(() =>
      expect(mockHandleMutationError).toHaveBeenCalledWith(error),
    );
    expect(result.current.open).toBe(true);
  });
});
