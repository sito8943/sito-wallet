import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

const {
  mockResetUser,
  mockShowErrorNotification,
  mockShowSuccessNotification,
  mockLogoutUser,
  mockUseAuth,
} = vi.hoisted(() => {
  const mockResetUser = vi.fn();
  const mockShowErrorNotification = vi.fn();
  const mockShowSuccessNotification = vi.fn();
  const mockLogoutUser = vi.fn();
  const mockUseAuth = vi.fn(() => ({
    account: { id: 1, email: "admin@example.com" },
    logoutUser: mockLogoutUser,
  }));

  return {
    mockResetUser,
    mockShowErrorNotification,
    mockShowSuccessNotification,
    mockLogoutUser,
    mockUseAuth,
  };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@sito/dashboard-app", () => ({
  useAuth: () => mockUseAuth(),
  useNotification: () => ({
    showErrorNotification: mockShowErrorNotification,
    showSuccessNotification: mockShowSuccessNotification,
  }),
}));

vi.mock("providers", () => ({
  useManager: () => ({
    Users: {
      reset: mockResetUser,
    },
  }),
}));

vi.mock("hooks", () => ({
  UsersQueryKeys: {
    all: () => ({
      queryKey: ["users"],
    }),
  },
}));

vi.mock("lib", () => ({}));

import { useResetUser } from "../useResetUser";

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useResetUser", () => {
  beforeEach(() => {
    mockResetUser.mockReset();
    mockShowErrorNotification.mockReset();
    mockShowSuccessNotification.mockReset();
    mockLogoutUser.mockReset();
    mockUseAuth.mockReturnValue({
      account: { id: 1, email: "admin@example.com" },
      logoutUser: mockLogoutUser,
    });
  });

  it("does not log out on self-reset and invalidates all queries", async () => {
    mockResetUser.mockResolvedValue(undefined);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useResetUser(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current
        .action({
          id: 1,
          email: "admin@example.com",
          username: "admin",
        } as never)
        .onClick?.();
    });

    act(() => {
      result.current.handleSubmit();
    });

    await waitFor(() => expect(mockResetUser).toHaveBeenCalledWith(1, false));
    await waitFor(() =>
      expect(mockShowSuccessNotification).toHaveBeenCalledWith({
        message: "_pages:users.reset.successMessage",
      }),
    );
    await waitFor(() => expect(result.current.open).toBe(false));

    await waitFor(() => expect(invalidateQueriesSpy).toHaveBeenCalledWith());
    expect(invalidateQueriesSpy).not.toHaveBeenCalledWith({
      queryKey: ["users"],
    });
    expect(mockLogoutUser).not.toHaveBeenCalled();
  });

  it("shows an error and keeps the dialog open when reset fails", async () => {
    mockResetUser.mockRejectedValue(new Error("reset failed"));

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useResetUser(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current
        .action({
          id: 1,
          email: "admin@example.com",
          username: "admin",
        } as never)
        .onClick?.();
    });

    act(() => {
      result.current.handleSubmit();
    });

    await waitFor(() =>
      expect(mockShowErrorNotification).toHaveBeenCalledWith({
        message: "_pages:users.reset.errorMessage",
      }),
    );

    expect(result.current.open).toBe(true);
    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });
});
