import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const { mockNavigate, mockUseAuth, mockSaveReturnTo } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUseAuth: vi.fn(),
  mockSaveReturnTo: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("@sito/dashboard-app", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("components", () => ({
  QueryError: () => <div data-testid="error-ui" />,
  SplashScreen: () => <div data-testid="splash" />,
}));

vi.mock("lib", async () => ({
  ...(await import("../../lib/utils/sessionAccess")),
  AppRoutes: { signIn: "/auth/sign-in" },
  saveReturnTo: mockSaveReturnTo,
}));

import { Standalone } from "../Standalone";

const renderAt = (entry: string) =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route element={<Standalone />}>
          <Route
            path="/oauth/consent"
            element={<div data-testid="consent" />}
          />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe("Standalone layout", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockSaveReturnTo.mockReset();
  });

  it("renders the page for a signed-in user", () => {
    mockUseAuth.mockReturnValue({ account: { id: 1, email: "a@b.c" } });

    renderAt("/oauth/consent?request=abc");

    expect(screen.getByTestId("consent")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockSaveReturnTo).not.toHaveBeenCalled();
  });

  it("sends anonymous visitors to sign-in and remembers the full URL", () => {
    mockUseAuth.mockReturnValue({ account: {} });

    renderAt("/oauth/consent?request=abc");

    expect(screen.queryByTestId("consent")).not.toBeInTheDocument();
    expect(screen.getByTestId("splash")).toBeInTheDocument();
    expect(mockSaveReturnTo).toHaveBeenCalledWith("/oauth/consent?request=abc");
    expect(mockNavigate).toHaveBeenCalledWith("/auth/sign-in", {
      replace: true,
    });
  });
});
