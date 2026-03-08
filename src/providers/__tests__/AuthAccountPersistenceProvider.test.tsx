import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPersistPublicSessionAccount = vi.fn();
const mockUseAuth = vi.fn();

vi.mock("@sito/dashboard-app", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("lib", () => ({
  persistPublicSessionAccount: (
    ...args: Parameters<typeof mockPersistPublicSessionAccount>
  ) => mockPersistPublicSessionAccount(...args),
}));

import { AuthAccountPersistenceProvider } from "../AuthAccountPersistenceProvider";

describe("AuthAccountPersistenceProvider", () => {
  beforeEach(() => {
    mockPersistPublicSessionAccount.mockClear();
  });

  it("persists the public account snapshot when a session is available", async () => {
    const account = {
      id: 7,
      username: "sito",
      email: "sito@example.com",
      token: "token",
    };

    mockUseAuth.mockReturnValue({ account });

    render(
      <AuthAccountPersistenceProvider>
        <div>content</div>
      </AuthAccountPersistenceProvider>,
    );

    await waitFor(() =>
      expect(mockPersistPublicSessionAccount).toHaveBeenCalledWith(account),
    );
  });

  it("does not persist when the account has no token", async () => {
    mockUseAuth.mockReturnValue({
      account: {
        id: 7,
        username: "sito",
        email: "sito@example.com",
      },
    });

    render(
      <AuthAccountPersistenceProvider>
        <div>content</div>
      </AuthAccountPersistenceProvider>,
    );

    await waitFor(() =>
      expect(mockPersistPublicSessionAccount).not.toHaveBeenCalled(),
    );
  });
});
