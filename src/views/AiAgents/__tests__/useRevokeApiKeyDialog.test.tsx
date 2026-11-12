import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

const { mockRevoke, mockShowSuccessNotification, mockHandleMutationError } =
  vi.hoisted(() => ({
    mockRevoke: vi.fn(),
    mockShowSuccessNotification: vi.fn(),
    mockHandleMutationError: vi.fn(),
  }));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@sito/dashboard-app", () => ({
  useNotification: () => ({
    showSuccessNotification: mockShowSuccessNotification,
  }),
}));

vi.mock("providers", () => ({
  useManager: () => ({ ApiKeys: { revoke: mockRevoke } }),
}));

vi.mock("hooks", () => ({
  ApiKeysQueryKeys: { all: () => ({ queryKey: ["api-keys"] }) },
  useMutationErrorHandler: () => mockHandleMutationError,
}));

import { useRevokeApiKeyDialog } from "../hooks/useRevokeApiKeyDialog";

const apiKey = {
  id: 7,
  name: "Laptop",
  prefix: "swal_Ab12Cd",
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
  const hook = renderHook(() => useRevokeApiKeyDialog(), { wrapper });
  return { ...hook, invalidateSpy };
};

describe("useRevokeApiKeyDialog", () => {
  beforeEach(() => {
    mockRevoke.mockReset();
  });

  it("opens for a key and revokes it on confirm", async () => {
    mockRevoke.mockResolvedValue(undefined);
    const { result, invalidateSpy } = setup();

    act(() => result.current.openForKey(apiKey));
    expect(result.current.open).toBe(true);
    expect(result.current.target).toEqual(apiKey);

    act(() => result.current.handleSubmit());

    await waitFor(() => expect(result.current.open).toBe(false));
    expect(mockRevoke).toHaveBeenCalledWith(7);
    expect(mockShowSuccessNotification).toHaveBeenCalledWith({
      message: "_pages:aiAgents.keys.revoke.successMessage",
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["api-keys"] });
  });

  it("reports errors and keeps the dialog open", async () => {
    const error = { status: 404, message: "Not found" };
    mockRevoke.mockRejectedValue(error);
    const { result } = setup();

    act(() => result.current.openForKey(apiKey));
    act(() => result.current.handleSubmit());

    await waitFor(() =>
      expect(mockHandleMutationError).toHaveBeenCalledWith(error),
    );
    expect(result.current.open).toBe(true);
  });

  it("does nothing without a target", () => {
    const { result } = setup();

    act(() => result.current.handleSubmit());
    expect(mockRevoke).not.toHaveBeenCalled();
  });
});
