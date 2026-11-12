import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const { mockNavigate, mockLogUser, mockLogin, mockPeekReturnTo } = vi.hoisted(
  () => ({
    mockNavigate: vi.fn(),
    mockLogUser: vi.fn(),
    mockLogin: vi.fn(),
    mockPeekReturnTo: vi.fn<() => string | null>(),
  }),
);

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

type SignInValues = { email: string; password: string; rememberMe: boolean };

vi.mock("@sito/dashboard-app", () => ({
  AuthSignInView: ({
    onSubmit,
  }: {
    onSubmit: (values: SignInValues) => Promise<void>;
  }) => (
    <button
      type="button"
      onClick={() =>
        void onSubmit({ email: "a@b.c", password: "x", rememberMe: true })
      }
    >
      submit
    </button>
  ),
  isHttpError: () => false,
  useAuth: () => ({ logUser: mockLogUser }),
  useNotification: () => ({ showErrorNotification: vi.fn() }),
}));

vi.mock("components", () => ({ TextLogo: () => null }));

vi.mock("providers", () => ({
  useManager: () => ({ Auth: { login: mockLogin } }),
}));

vi.mock("lib", () => ({
  AppRoutes: {
    home: "/",
    signUp: "/auth/sign-up",
    recovery: "/auth/recovery",
  },
  peekReturnTo: () => mockPeekReturnTo(),
  randomBackgroundColor: () => "primary",
}));

import { SignIn } from "./SignIn";

describe("SignIn", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockLogUser.mockReset();
    mockLogin.mockReset().mockResolvedValue({ accessToken: "t" });
    mockPeekReturnTo.mockReset();
  });

  it("goes home after signing in", async () => {
    mockPeekReturnTo.mockReturnValue(null);
    render(<SignIn />);

    screen.getByRole("button", { name: "submit" }).click();

    await vi.waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
    expect(mockLogUser).toHaveBeenCalledWith({ accessToken: "t" }, true);
  });

  it("goes back to the page that asked for sign-in", async () => {
    mockPeekReturnTo.mockReturnValue("/oauth/consent?request=abc");
    render(<SignIn />);

    screen.getByRole("button", { name: "submit" }).click();

    await vi.waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/oauth/consent?request=abc"),
    );
  });
});
