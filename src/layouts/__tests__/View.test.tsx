import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

type MockOnboardingStep = {
  title: string;
  body: string;
};

// ─── Hoisted mocks ─────────────────────────────────────────────────────────────
const {
  mockNavigate,
  mockFromLocal,
  mockToLocal,
  mockIsInGuestMode,
  mockUseAuth,
  mockTranslate,
} = vi.hoisted(() => {
  const mockIsInGuestMode = vi.fn(() => false);
  const mockTranslate = vi.fn((key: string) => key);
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
    mockTranslate,
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
  ToTop: () => <div data-testid="to-top" />,
  Onboarding: ({ steps }: { steps: MockOnboardingStep[] }) => (
    <div
      data-testid="onboarding"
      data-steps={steps.map((step) => `${step.title}|${step.body}`).join(",")}
    />
  ),
  BaseLinkPropsType: class {},
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: mockTranslate,
  }),
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
    mockTranslate.mockReset().mockImplementation((key: string) => key);
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
          ?.split(",")
          .map((step) => step.split("|")[0]) ?? [];
      expect(steps).toHaveLength(5);
      expect(steps).toContain("_pages:onboarding.welcome.title");
      expect(steps).toContain("_pages:onboarding.get_started.title");
    });
  });

  describe("layout structure", () => {
    it("renders the Outlet (child routes)", () => {
      renderView({ email: "user@example.com" });
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
    });

    it("does not trigger navigation during render", () => {
      renderView({ email: "user@example.com" });
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("renders the ToTop button", () => {
      renderView({ email: "user@example.com" });
      expect(screen.getByTestId("to-top")).toBeInTheDocument();
    });
  });
});
