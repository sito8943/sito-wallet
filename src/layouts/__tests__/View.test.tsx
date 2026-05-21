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
  mockUseAppPreload,
} = vi.hoisted(() => {
  const mockIsInGuestMode = vi.fn(() => false);
  const mockTranslate = vi.fn((key: string) => key);
  const mockUseAuth = vi.fn(() => ({
    account: { email: "" },
    isInGuestMode: mockIsInGuestMode,
  }));
  const mockUseAppPreload = vi.fn(() => ({
    loading: false,
    completedTaskKeys: [],
    failedTaskKeys: [],
  }));
  return {
    mockNavigate: vi.fn(),
    mockFromLocal: vi.fn(() => null),
    mockToLocal: vi.fn(),
    mockIsInGuestMode,
    mockUseAuth,
    mockTranslate,
    mockUseAppPreload,
  };
});

// ─── Module mocks ──────────────────────────────────────────────────────────────

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@sito/dashboard-app", () => ({
  BaseClient: class {},
  APIClient: class {},
  AuthClient: class {},
  IndexedDBClient: class {},
  IManager: class {},
  Methods: {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE",
  },
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
  BottomNavActionProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  AppShell: ({
    header,
    footer,
    bottomNavigation,
    extras,
    children,
  }: {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    bottomNavigation?: React.ReactNode;
    extras?: React.ReactNode;
    children?: React.ReactNode;
  }) => (
    <div data-testid="app-shell">
      {header}
      {children}
      {footer}
      {bottomNavigation}
      {extras}
    </div>
  ),
  DashboardHeader: () => <header data-testid="header" />,
  DashboardFooter: () => (
    <footer data-testid="footer">
      <div data-testid="to-top" />
    </footer>
  ),
  Error: ({ error }: { error: Error }) => (
    <div data-testid="error-ui">{error?.message}</div>
  ),
  ToTop: () => <div data-testid="to-top" />,
  Notification: () => <div data-testid="notification" />,
  BottomNavigation: () => <div data-testid="bottom-navigation" />,
  Onboarding: ({ steps }: { steps: MockOnboardingStep[] }) => (
    <div
      data-testid="onboarding"
      data-steps={steps.map((step) => `${step.title}|${step.body}`).join(",")}
    />
  ),
  SplashScreen: () => <div data-testid="splash-screen" />,
  BaseLinkPropsType: class {},
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: mockTranslate,
    i18n: { resolvedLanguage: "en" },
  }),
}));

vi.mock("hooks", () => ({
  useAppPreload: () => mockUseAppPreload(),
}));

vi.mock("components", () => ({
  SearchModal: () => <div data-testid="search-modal" />,
  OfflineBanner: () => <div data-testid="offline-banner" />,
}));

vi.mock("providers", () => ({
  useFeatureFlags: () => ({ isFeatureEnabled: () => true }),
}));

vi.mock("views/menuMap", () => ({
  getFeatureFilteredMenuMap: () => [],
}));

vi.mock("../../config", () => ({
  config: {
    onboarding: "test-onboarding",
    apiUrl: "",
    auth: {
      user: "user",
      remember: "remember",
      refreshTokenKey: "refreshToken",
      accessTokenExpiresAtKey: "accessTokenExpiresAt",
    },
  },
}));

vi.mock("../../views/bottomMap", () => ({
  getFeatureFilteredBottomMap: () => [
    {
      id: "home",
      page: "home",
      to: "/",
      icon: null,
      position: "left",
    },
    {
      id: "profile",
      page: "profile",
      to: "/profile",
      icon: null,
      position: "right",
    },
  ],
}));

vi.mock("../../layouts/View/components/OnboardingSetup", () => ({
  OnboardingSetup: () => <div data-testid="onboarding-setup-content" />,
}));

import { View } from "../../layouts/View/View";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const HomePage = () => <div data-testid="home-page">Home</div>;
const SignInPage = () => <div data-testid="sign-in">Sign In</div>;

function renderView({
  email = "user@example.com",
  guestMode = false,
  onboardingDone = false,
  initialPath = "/",
}: {
  email?: string | null;
  guestMode?: boolean;
  onboardingDone?: boolean;
  initialPath?: string;
} = {}) {
  mockIsInGuestMode.mockReturnValue(guestMode);
  mockUseAuth.mockReturnValue({
    account: email === null ? null : { email },
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
    </MemoryRouter>,
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
    mockUseAppPreload.mockReset().mockReturnValue({
      loading: false,
      completedTaskKeys: [],
      failedTaskKeys: [],
    });
  });

  describe("onboarding", () => {
    it("shows Onboarding when localStorage key is not set (first visit)", () => {
      renderView({ email: "user@example.com" });
      expect(screen.getByTestId("onboarding")).toBeInTheDocument();
    });

    it("does NOT show Onboarding when localStorage key is set for authenticated users", () => {
      mockFromLocal.mockReturnValue(true);
      renderView({ email: "user@example.com", onboardingDone: true });
      expect(screen.queryByTestId("onboarding")).toBeNull();
    });

    it("keeps showing Onboarding for anonymous visitors even if the localStorage key is set", () => {
      renderView({ email: null, onboardingDone: true });
      expect(screen.getByTestId("onboarding")).toBeInTheDocument();
    });

    it("does NOT show Onboarding when localStorage key is set for guest mode", () => {
      renderView({ email: null, guestMode: true, onboardingDone: true });
      expect(screen.queryByTestId("onboarding")).toBeNull();
    });

    it("saves onboarding flag to localStorage for authenticated first visits", () => {
      renderView({ email: "user@example.com" });
      expect(mockToLocal).toHaveBeenCalledWith("test-onboarding", true);
    });

    it("does NOT save the onboarding flag for anonymous visitors", () => {
      renderView({ email: null });
      expect(mockToLocal).not.toHaveBeenCalled();
    });

    it("renders with all 5 onboarding steps", () => {
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
    it("shows SplashScreen while preload is running", () => {
      mockUseAppPreload.mockReturnValue({
        loading: true,
        completedTaskKeys: [],
        failedTaskKeys: [],
      });

      renderView({ email: "user@example.com" });
      expect(screen.getByTestId("splash-screen")).toBeInTheDocument();
      expect(screen.queryByTestId("home-page")).toBeNull();
    });

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
