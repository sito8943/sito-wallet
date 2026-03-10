import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// ─── Module mocks ──────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom"
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockUseAuth = vi.fn(() => ({
  account: { email: "" },
  isInGuestMode: vi.fn(() => false),
}));

vi.mock("@sito/dashboard-app", () => ({
  useAuth: () => mockUseAuth(),
  Error: ({ error }: { error: Error }) => (
    <div data-testid="error-ui">{error?.message}</div>
  ),
  Notification: () => <div data-testid="notification" />,
}));

import { Auth } from "../../layouts/Auth/Auth";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SignInPage = () => <div data-testid="sign-in-page">Sign In</div>;
const DashboardPage = () => <div data-testid="dashboard">Dashboard</div>;

function renderAuth(
  account: { email?: string } = {}
) {
  mockUseAuth.mockReturnValue({
    account: { email: account.email ?? "" },
    isInGuestMode: vi.fn(() => false),
  });

  return render(
    <MemoryRouter initialEntries={["/auth/sign-in"]}>
      <Routes>
        <Route element={<Auth />}>
          <Route path="/auth/sign-in" element={<SignInPage />} />
        </Route>
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </MemoryRouter>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Auth layout", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  describe("redirect when authenticated", () => {
    it("calls navigate('/') when account.email is set", () => {
      renderAuth({ email: "user@example.com" });

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("does NOT call navigate when account.email is empty", () => {
      renderAuth({ email: "" });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("does NOT call navigate when account has no email property", () => {
      mockUseAuth.mockReturnValue({
        account: {},
        isInGuestMode: vi.fn(() => false),
      });

      render(
        <MemoryRouter initialEntries={["/auth/sign-in"]}>
          <Routes>
            <Route element={<Auth />}>
              <Route path="/auth/sign-in" element={<SignInPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("renders children via Outlet", () => {
    it("renders the child route content", () => {
      renderAuth({ email: "" });

      expect(screen.getByTestId("sign-in-page")).toBeInTheDocument();
    });
  });
});
