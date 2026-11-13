import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import type { OAuthRequestDto } from "lib";

const {
  mockGetRequest,
  mockApprove,
  mockDeny,
  mockShowError,
  mockSaveReturnTo,
} = vi.hoisted(() => ({
  mockGetRequest: vi.fn(),
  mockApprove: vi.fn(),
  mockDeny: vi.fn(),
  mockShowError: vi.fn(),
  mockSaveReturnTo: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      if (!opts) return key;
      const { interpolation, ...values } = opts;
      void interpolation;
      return `${key} ${JSON.stringify(values)}`;
    },
  }),
}));

vi.mock("@sito/dashboard-app", () => ({
  isHttpError: (error: unknown) =>
    typeof error === "object" &&
    error !== null &&
    typeof (error as { status?: unknown }).status === "number",
  useAuth: () => ({ account: { id: 1, email: "ana@example.com" } }),
  useNotification: () => ({ showErrorNotification: mockShowError }),
  Button: ({
    children,
    ...rest
  }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) => {
    const { variant, color, ...props } = rest as Record<string, unknown>;
    void variant;
    void color;
    return (
      <button {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
        {children}
      </button>
    );
  },
  Error: ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <button type="button" onClick={onRetry}>
      {message}
    </button>
  ),
  Loading: () => <span>loading</span>,
}));

vi.mock("components", async () => ({
  ...(await import("../../../components/McpAccessSelector")),
  TextLogo: () => <span>logo</span>,
  McpCapabilityList: () => <ul aria-label="capabilities" />,
}));

vi.mock("providers", () => ({
  useManager: () => ({
    OAuth: {
      getRequest: mockGetRequest,
      approve: mockApprove,
      deny: mockDeny,
    },
  }),
}));

vi.mock("hooks", async () => ({
  ...(await import("../../../hooks/queries/useOAuth")),
}));

vi.mock("lib", async () => ({
  ...(await import("../../../lib/routes")),
  ...(await import("../../../lib/utils/url")),
  ...(await import("../../../lib/mcp")),
  saveReturnTo: mockSaveReturnTo,
}));

import { OAuthConsent } from "../OAuthConsent";

const request: OAuthRequestDto = {
  id: "req_1",
  clientName: "ChatGPT",
  clientUri: null,
  redirectHost: "chatgpt.com",
  resource: "https://api.wallet.sito8943.com/mcp",
  resourceName: "Sito Wallet",
  scopes: ["mcp"],
  expiresAt: "2026-11-12T10:10:00Z",
};

const CODE_URL = "https://chatgpt.com/cb?code=abc&state=s";
const DENIED_URL = "https://chatgpt.com/cb?error=access_denied&state=s";

const renderConsent = (entry = "/oauth/consent?request=req_1") => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route path="/oauth/consent" element={<OAuthConsent />} />
          <Route path="/" element={<div>home page</div>} />
          <Route path="/sign-out" element={<div>sign out page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

const allowButton = () =>
  screen.getByRole("button", { name: "_pages:oauthConsent.allow" });
const denyButton = () =>
  screen.getByRole("button", { name: "_pages:oauthConsent.deny" });

describe("OAuthConsent", () => {
  const assign = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Only `assign` is used: MemoryRouter never reads window.location.
    vi.stubGlobal("location", { assign });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the loading state while the request loads", () => {
    mockGetRequest.mockReturnValue(new Promise(() => {}));
    renderConsent();

    expect(screen.getByText("loading")).toBeInTheDocument();
    expect(mockGetRequest).toHaveBeenCalledWith("req_1");
  });

  it("shows who asks, the account, the redirect host and the capabilities", async () => {
    mockGetRequest.mockResolvedValue(request);
    renderConsent();

    expect(
      await screen.findByText(/_pages:oauthConsent.heading/),
    ).toHaveTextContent('"client":"ChatGPT"');
    expect(screen.getByText(/_pages:oauthConsent.heading/)).toHaveTextContent(
      '"resource":"Sito Wallet"',
    );
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
    expect(screen.getByText(/_pages:oauthConsent.redirect/)).toHaveTextContent(
      '"host":"chatgpt.com"',
    );
    expect(screen.getByLabelText("capabilities")).toBeInTheDocument();
    expect(
      screen.getByText("_pages:oauthConsent.revokeNote"),
    ).toBeInTheDocument();
  });

  it("approves and leaves for the redirect URL with the code", async () => {
    mockGetRequest.mockResolvedValue(request);
    let resolveApprove: (value: { redirectUrl: string }) => void = () => {};
    mockApprove.mockReturnValue(
      new Promise((resolve) => {
        resolveApprove = resolve;
      }),
    );
    renderConsent();

    fireEvent.click(
      await screen.findByRole("button", {
        name: "_pages:oauthConsent.allow",
      }),
    );

    await waitFor(() => expect(allowButton()).toBeDisabled());
    expect(denyButton()).toBeDisabled();
    expect(mockApprove).toHaveBeenCalledWith("req_1", "FULL");

    resolveApprove({ redirectUrl: CODE_URL });

    await waitFor(() => expect(assign).toHaveBeenCalledWith(CODE_URL));
    expect(mockDeny).not.toHaveBeenCalled();
    expect(allowButton()).toBeDisabled();
  });

  it("defaults to read and write access", async () => {
    mockGetRequest.mockResolvedValue(request);
    renderConsent();

    expect(
      await screen.findByRole("radio", {
        name: /_pages:aiAgents.access.levels.full.label/,
      }),
    ).toBeChecked();
  });

  it.each([
    ["read", "READ"],
    ["write", "WRITE"],
  ])("approves with the %s access level", async (key, access) => {
    mockGetRequest.mockResolvedValue(request);
    mockApprove.mockResolvedValue({ redirectUrl: CODE_URL });
    renderConsent();

    fireEvent.click(
      await screen.findByRole("radio", {
        name: new RegExp(`_pages:aiAgents.access.levels.${key}.label`),
      }),
    );
    fireEvent.click(allowButton());

    await waitFor(() =>
      expect(mockApprove).toHaveBeenCalledWith("req_1", access),
    );
  });

  it("denies and leaves for the redirect URL with the error", async () => {
    mockGetRequest.mockResolvedValue(request);
    mockDeny.mockResolvedValue({ redirectUrl: DENIED_URL });
    renderConsent();

    fireEvent.click(
      await screen.findByRole("button", {
        name: "_pages:oauthConsent.deny",
      }),
    );

    await waitFor(() => expect(assign).toHaveBeenCalledWith(DENIED_URL));
    expect(mockDeny).toHaveBeenCalledWith("req_1");
    expect(mockApprove).not.toHaveBeenCalled();
  });

  it("never follows a non-http redirect URL", async () => {
    mockGetRequest.mockResolvedValue(request);
    mockApprove.mockResolvedValue({ redirectUrl: "javascript:alert(1)" });
    renderConsent();

    fireEvent.click(
      await screen.findByRole("button", {
        name: "_pages:oauthConsent.allow",
      }),
    );

    await waitFor(() =>
      expect(mockShowError).toHaveBeenCalledWith({
        message: "_pages:oauthConsent.errors.invalidRedirect",
      }),
    );
    expect(assign).not.toHaveBeenCalled();
    expect(allowButton()).not.toBeDisabled();
  });

  it("re-enables the buttons when the answer fails", async () => {
    mockGetRequest.mockResolvedValue(request);
    mockApprove.mockRejectedValue({ status: 500, message: "boom" });
    renderConsent();

    fireEvent.click(
      await screen.findByRole("button", {
        name: "_pages:oauthConsent.allow",
      }),
    );

    await waitFor(() =>
      expect(mockShowError).toHaveBeenCalledWith({
        message: "_pages:oauthConsent.errors.decision",
      }),
    );
    expect(allowButton()).not.toBeDisabled();
    expect(assign).not.toHaveBeenCalled();
  });

  it("shows the expired state when the request is unknown (404)", async () => {
    mockGetRequest.mockRejectedValue({ status: 404, message: "not found" });
    renderConsent();

    expect(
      await screen.findByText("_pages:oauthConsent.notFound.title"),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("link", { name: "_pages:oauthConsent.notFound.home" }),
    );
    expect(screen.getByText("home page")).toBeInTheDocument();
  });

  it("shows the expired state when the request expires before answering", async () => {
    mockGetRequest.mockResolvedValue(request);
    mockApprove.mockRejectedValue({ status: 404, message: "not found" });
    renderConsent();

    fireEvent.click(
      await screen.findByRole("button", {
        name: "_pages:oauthConsent.allow",
      }),
    );

    expect(
      await screen.findByText("_pages:oauthConsent.notFound.title"),
    ).toBeInTheDocument();
    expect(assign).not.toHaveBeenCalled();
  });

  it("shows the expired state without a request id", () => {
    renderConsent("/oauth/consent");

    expect(
      screen.getByText("_pages:oauthConsent.notFound.title"),
    ).toBeInTheDocument();
    expect(mockGetRequest).not.toHaveBeenCalled();
  });

  it("shows a retryable error for other failures", async () => {
    mockGetRequest.mockRejectedValueOnce({ status: 500, message: "boom" });
    mockGetRequest.mockResolvedValueOnce(request);
    renderConsent();

    fireEvent.click(
      await screen.findByRole("button", {
        name: "_pages:oauthConsent.errors.load",
      }),
    );

    expect(
      await screen.findByText(/_pages:oauthConsent.heading/),
    ).toBeVisible();
    expect(mockGetRequest).toHaveBeenCalledTimes(2);
  });

  it("signs in again and comes back when the session is rejected (401)", async () => {
    mockGetRequest.mockRejectedValue({ status: 401, message: "expired" });
    renderConsent();

    expect(await screen.findByText("sign out page")).toBeInTheDocument();
    expect(mockSaveReturnTo).toHaveBeenCalledWith(
      "/oauth/consent?request=req_1",
    );
  });

  it("switches account through sign-out, keeping the consent URL", async () => {
    mockGetRequest.mockResolvedValue(request);
    renderConsent();

    fireEvent.click(
      await screen.findByRole("button", {
        name: "_pages:oauthConsent.switchAccount",
      }),
    );

    expect(mockSaveReturnTo).toHaveBeenCalledWith(
      "/oauth/consent?request=req_1",
    );
    expect(screen.getByText("sign out page")).toBeInTheDocument();
  });
});
