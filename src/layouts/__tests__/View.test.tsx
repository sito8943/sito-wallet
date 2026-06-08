import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// ─── Hoisted mocks ─────────────────────────────────────────────────────────────
const {
  mockNavigate,
  mockFromLocal,
  mockUseAuth,
  mockTranslate,
  mockUseAppPreload,
  mockIsFeatureEnabled,
} = vi.hoisted(() => {
  const mockTranslate = vi.fn((key: string) => key);
  const mockUseAuth = vi.fn(() => ({
    account: { email: "" },
  }));
  const mockUseAppPreload = vi.fn(() => ({
    loading: false,
    completedTaskKeys: [],
    failedTaskKeys: [],
  }));
  const mockIsFeatureEnabled = vi.fn(() => true);
  return {
    mockNavigate: vi.fn(),
    mockFromLocal: vi.fn(() => null),
    mockUseAuth,
    mockTranslate,
    mockUseAppPreload,
    mockIsFeatureEnabled,
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
  useNotification: () => ({
    showErrorNotification: vi.fn(),
  }),
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
  useOnlineStatus: () => true,
}));

vi.mock("components", () => ({
  SearchModal: () => <div data-testid="search-modal" />,
  OfflineBanner: () => <div data-testid="offline-banner" />,
}));

vi.mock("lib", () => ({
  AppRoutes: {
    signIn: "/auth/sign-in",
    signOut: "/sign-out",
    onboarding: "/onboarding",
    home: "/",
    transactions: "/transactions",
    profile: "/profile",
    about: "/about-us",
    cookiesPolicy: "/cookies-policy",
    privacyPolicy: "/privacy-policy",
    termsAndConditions: "/terms-and-conditions",
    notFound: "*",
  },
  isAnonymousVisitorSession: (account?: { id?: number | null } | null) =>
    !account?.id,
}));

vi.mock("providers", () => ({
  useFeatureFlags: () => ({
    isFeatureEnabled: mockIsFeatureEnabled,
  }),
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

import { View } from "../../layouts/View/View";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const HomePage = () => <div data-testid="home-page">Home</div>;
const SignInPage = () => <div data-testid="sign-in">Sign In</div>;

function renderView({
  email = "user@example.com",
  onboardingDone = false,
  initialPath = "/",
  accountId = 99 as number | undefined,
}: {
  email?: string | null;
  onboardingDone?: boolean;
  initialPath?: string;
  accountId?: number;
} = {}) {
  mockUseAuth.mockReturnValue({
    account: email === null ? null : { id: accountId, email },
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
          <Route path="/transactions" element={<div data-testid="tx" />} />
          <Route path="/privacy-policy" element={<div data-testid="pp" />} />
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
    mockTranslate.mockReset().mockImplementation((key: string) => key);
    mockUseAppPreload.mockReset().mockReturnValue({
      loading: false,
      completedTaskKeys: [],
      failedTaskKeys: [],
    });
    mockIsFeatureEnabled.mockReset().mockReturnValue(true);
  });

  describe("anonymous redirect guard", () => {
    it("does not redirect authenticated users on home (first visit)", () => {
      renderView({ email: "user@example.com" });
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
    });

    it("does not redirect authenticated users when onboarding is already done", () => {
      renderView({ email: "user@example.com", onboardingDone: true });
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
    });

    it("redirects anonymous visitors on home to sign in when onboarding was seen (e.g. expired session)", () => {
      renderView({ email: null, onboardingDone: true });
      expect(mockNavigate).toHaveBeenCalledWith("/auth/sign-in", {
        replace: true,
      });
    });

    it("redirects first-time anonymous visitors on home to onboarding", () => {
      renderView({ email: null, onboardingDone: false });
      expect(mockNavigate).toHaveBeenCalledWith("/onboarding", {
        replace: true,
      });
    });

    it("redirects anonymous visitors on private routes to sign in when onboarding was seen", () => {
      renderView({
        email: null,
        onboardingDone: true,
        initialPath: "/transactions",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/auth/sign-in", {
        replace: true,
      });
    });

    it("does not redirect anonymous visitors away from public informational routes", () => {
      renderView({
        email: null,
        onboardingDone: true,
        initialPath: "/privacy-policy",
      });
      expect(mockNavigate).not.toHaveBeenCalled();
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
