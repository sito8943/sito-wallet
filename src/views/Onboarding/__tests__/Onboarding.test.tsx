import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

type MockOnboardingStep = { title: string; body: string };

// ─── Hoisted mocks ─────────────────────────────────────────────────────────────
const {
  mockNavigate,
  mockToLocal,
  mockUseAuth,
  mockIsFeatureEnabled,
  mockGetUserEntityConfigs,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockToLocal: vi.fn(),
  mockUseAuth: vi.fn(() => ({ account: { id: 1, email: "u@e.com" } })),
  mockIsFeatureEnabled: vi.fn(() => true),
  mockGetUserEntityConfigs: vi.fn(() => Promise.resolve([])),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@sito/dashboard-app", () => ({
  useAuth: () => mockUseAuth(),
  toLocal: mockToLocal,
  // Minimal stand-in: exposes steps as data + an exit button wired to onSignIn.
  Onboarding: ({
    steps,
    onSignIn,
  }: {
    steps: MockOnboardingStep[];
    onSignIn: () => void;
  }) => (
    <div
      data-testid="onboarding"
      data-steps={steps.map((s) => s.title).join(",")}
    >
      <button data-testid="exit" onClick={onSignIn}>
        exit
      </button>
    </div>
  ),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("hooks", () => ({ useOnlineStatus: () => true }));

vi.mock("providers", () => ({
  useFeatureFlags: () => ({
    isFeatureEnabled: mockIsFeatureEnabled,
    applyFeaturePayload: vi.fn(),
  }),
  useManager: () => ({
    UserEntityConfigs: { getAll: mockGetUserEntityConfigs },
  }),
}));

vi.mock("lib", () => {
  const UserEntityConfigKey = {
    Currencies: "currencies",
    Accounts: "accounts",
    Transactions: "transactions",
    Subscriptions: "subscriptions",
  } as const;
  return {
    AppRoutes: { signIn: "/auth/sign-in" },
    EntityName: {
      Currency: "currency",
      Account: "account",
      Transaction: "transaction",
      Subscription: "subscription",
    },
    UserEntityConfigKey,
    USER_ENTITY_CONFIG_KEYS: Object.values(UserEntityConfigKey),
    configsToEnabledEntityKeys: (c: Array<{ key: string }>) =>
      c.map((x) => x.key),
    entityKeysToConfigs: (k: string[]) => k.map((key) => ({ key })),
    resolveRequiredEntityKeys: (k: string[]) => k,
    userEntityConfigsToFeaturePayload: (c: unknown[]) => ({ c }),
  };
});

vi.mock("../../../config", () => ({
  config: { onboarding: "test-onboarding" },
}));

import { Onboarding } from "../Onboarding";

describe("Onboarding view", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockToLocal.mockReset();
    mockIsFeatureEnabled.mockReset().mockReturnValue(true);
  });

  it("renders welcome, debts and get-started steps when debts enabled", () => {
    render(<Onboarding />);
    const steps =
      screen.getByTestId("onboarding").getAttribute("data-steps")?.split(",") ??
      [];
    expect(steps).toContain("_pages:onboarding.welcome.title");
    expect(steps).toContain("_pages:onboarding.debts.title");
    expect(steps).toContain("_pages:onboarding.get_started.title");
  });

  it("omits the debts step when the feature is disabled", () => {
    mockIsFeatureEnabled.mockReturnValue(false);
    render(<Onboarding />);
    const steps =
      screen.getByTestId("onboarding").getAttribute("data-steps")?.split(",") ??
      [];
    expect(steps).not.toContain("_pages:onboarding.debts.title");
  });

  it("marks onboarding as seen and navigates to sign-in on exit", () => {
    render(<Onboarding />);
    fireEvent.click(screen.getByTestId("exit"));
    expect(mockToLocal).toHaveBeenCalledWith("test-onboarding", true);
    expect(mockNavigate).toHaveBeenCalledWith("/auth/sign-in", {
      replace: true,
    });
  });
});
