import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// ─── Hoisted mocks ─────────────────────────────────────────────────────────────
const {
  mockNavigate,
  mockFromLocal,
  mockToLocal,
  mockIsInGuestMode,
  mockUseAuth,
} = vi.hoisted(() => {
  const mockIsInGuestMode = vi.fn(() => false);
  const mockUseAuth = vi.fn(() => ({
    account: { email: "" },
    isInGuestMode: mockIsInGuestMode,
  }));
  return {
    mockNavigate: vi.fn(),
    mockFromLocal: vi.fn(() => null),
    mockToLocal: vi.fn(),
    mockIsInGuestMode,
    mockUseAuth,
  };
});

// ─── Module mocks ──────────────────────────────────────────────────────────────

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

vi.mock("@sito/dashboard-app", () => ({
  useAuth: () => mockUseAuth(),
  fromLocal: mockFromLocal,
  toLocal: mockToLocal,
  ConfigProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  TableOptionsProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  NavbarProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  Error: ({ error }: { error: Error }) => (
    <div data-testid="error-ui">{error?.message}</div>
  ),
  Notification: () => <div data-testid="notification" />,
  ToTop: () => <div data-testid="to-top" />,
  Onboarding: ({ steps }: { steps: string[] }) => (
    <div data-testid="onboarding" data-steps={steps.join(",")} />
  ),
  BaseLinkPropsType: class {},
}));

vi.mock("components", () => ({
  SearchModal: () => <div data-testid="search-modal" />,
}));

vi.mock("../../config", () => ({
  config: { onboarding: "test-onboarding" },
}));

vi.mock("../../layouts/View/Header", () => ({
  default: () => <header data-testid="header" />,
}));

vi.mock("../../layouts/View/Footer", () => ({
  default: () => <footer data-testid="footer" />,
}));

import { View } from "../../layouts/View/View";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const HomePage = () => <div data-testid="home-page">Home</div>;
const SignInPage = () => <div data-testid="sign-in">Sign In</div>;

function renderView({
  email = "",
  guestMode = false,
  onboardingDone = false,
  initialPath = "/",
}: {
  email?: string;
  guestMode?: boolean;
  onboardingDone?: boolean;
  initialPath?: string;
} = {}) {
  mockIsInGuestMode.mockReturnValue(guestMode);
  mockUseAuth.mockReturnValue({
    account: { email },
    isInGuestMode: mockIsInGuestMode,
  });
  mockFromLocal.mockImplementation((key: string) => {
    if (key === "test-onboarding") return onboardingDone ? true : null;
    return null;
  });

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<View />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="/auth/sign-in" element={<SignInPage />} />
      </Routes>
    </MemoryRouter>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("View layout", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockFromLocal.mockReset().mockReturnValue(null);
    mockToLocal.mockReset();
    mockIsInGuestMode.mockReturnValue(false);
  });

  describe("authentication redirect", () => {
    it("redirects to /auth/sign-in when not authenticated and onboarding was done", () => {
      renderView({ email: "", guestMode: false, onboardingDone: true });
      expect(mockNavigate).toHaveBeenCalledWith("/auth/sign-in");
    });

    it("does NOT redirect when user is authenticated", () => {
      renderView({ email: "user@example.com", onboardingDone: true });
      expect(mockNavigate).not.toHaveBeenCalledWith("/auth/sign-in");
    });

    it("does NOT redirect when in guest mode", () => {
      renderView({ email: "", guestMode: true, onboardingDone: true });
      expect(mockNavigate).not.toHaveBeenCalledWith("/auth/sign-in");
    });
  });

  describe("onboarding", () => {
    it("shows Onboarding when localStorage key is not set (first visit)", () => {
      mockFromLocal.mockReturnValue(null);
      renderView({ email: "user@example.com" });
      expect(screen.getByTestId("onboarding")).toBeInTheDocument();
    });

    it("does NOT show Onboarding when localStorage key is set", () => {
      mockFromLocal.mockReturnValue(true);
      renderView({ email: "user@example.com", onboardingDone: true });
      expect(screen.queryByTestId("onboarding")).toBeNull();
    });

    it("saves onboarding flag to localStorage on first visit", () => {
      mockFromLocal.mockReturnValue(null);
      renderView({ email: "user@example.com" });
      expect(mockToLocal).toHaveBeenCalledWith("test-onboarding", true);
    });

    it("renders with all 5 onboarding steps", () => {
      mockFromLocal.mockReturnValue(null);
      renderView({ email: "user@example.com" });

      const steps =
        screen
          .getByTestId("onboarding")
          .getAttribute("data-steps")
          ?.split(",") ?? [];
      expect(steps).toHaveLength(5);
      expect(steps).toContain("welcome");
      expect(steps).toContain("get_started");
    });
  });

  describe("layout structure", () => {
    it("renders the Outlet (child routes)", () => {
      renderView({ email: "user@example.com" });
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
    });

    it("renders the Notification component", () => {
      renderView({ email: "user@example.com" });
      expect(screen.getByTestId("notification")).toBeInTheDocument();
    });

    it("renders the ToTop button", () => {
      renderView({ email: "user@example.com" });
      expect(screen.getByTestId("to-top")).toBeInTheDocument();
    });
  });
});
