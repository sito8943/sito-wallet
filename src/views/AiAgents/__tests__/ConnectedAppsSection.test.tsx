import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { OAuthGrantDto } from "lib";

vi.mock("lib", async () => ({
  ...(await import("../../../lib/mcp")),
  ...(await import("../../../lib/utils/date")),
}));

vi.mock("components", async () => ({
  ...(await import("../../../components/McpAccessBadge")),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts ? `${key} ${JSON.stringify(opts)}` : key,
  }),
}));

vi.mock("@sito/dashboard-app", () => ({
  IconButton: ({
    onClick,
    disabled,
    "aria-label": ariaLabel,
  }: {
    onClick: () => void;
    disabled?: boolean;
    "aria-label"?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    />
  ),
  Error: ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <button type="button" onClick={onRetry}>
      {message}
    </button>
  ),
  Loading: () => <span>loading</span>,
}));

import { ConnectedAppsSection } from "../components/ConnectedAppsSection";

const buildGrant = (
  id: number,
  clientName: string,
  lastUsedAt: string | null = null,
  scopes: string[] = ["mcp"],
): OAuthGrantDto => ({
  id,
  clientName,
  resource: "https://api.wallet.sito8943.com/mcp",
  resourceName: "Sito Wallet",
  scopes,
  createdAt: "2026-11-01T10:00:00Z",
  lastUsedAt,
});

const renderSection = (
  grants: OAuthGrantDto[],
  state: { isLoading?: boolean; hasError?: boolean } = {},
) => {
  const props = {
    grants,
    isLoading: state.isLoading ?? false,
    hasError: state.hasError ?? false,
    onRetry: vi.fn(),
    onDisconnect: vi.fn(),
  };
  render(<ConnectedAppsSection {...props} />);
  return props;
};

describe("ConnectedAppsSection", () => {
  it("shows the empty state", () => {
    renderSection([]);

    expect(screen.getByText("_pages:aiAgents.apps.empty")).toBeInTheDocument();
  });

  it("lists apps with connection and last use dates, and disconnects one", () => {
    const claude = buildGrant(2, "claude.ai", "2026-11-10T08:00:00Z");
    const props = renderSection([buildGrant(1, "ChatGPT"), claude]);

    expect(screen.getByText("ChatGPT")).toBeInTheDocument();
    expect(screen.getByText("claude.ai")).toBeInTheDocument();
    expect(
      screen.getAllByText(/_pages:aiAgents.apps.connectedAt/),
    ).toHaveLength(2);
    expect(
      screen.getByText("_pages:aiAgents.keys.neverUsed"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/_pages:aiAgents.keys.lastUsed/),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByLabelText("_pages:aiAgents.apps.disconnectAction: claude.ai"),
    );
    expect(props.onDisconnect).toHaveBeenCalledWith(claude);
  });

  it("shows the access level derived from the scopes", () => {
    renderSection([
      buildGrant(1, "ChatGPT"),
      buildGrant(2, "claude.ai", null, ["mcp", "mcp:read-only"]),
      buildGrant(3, "Other", null, ["mcp", "mcp:write-only"]),
    ]);

    expect(
      screen.getByText("_pages:aiAgents.access.levels.full.label"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("_pages:aiAgents.access.levels.read.label"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("_pages:aiAgents.access.levels.write.label"),
    ).toBeInTheDocument();
  });

  it("shows the loader while loading", () => {
    renderSection([], { isLoading: true });

    expect(screen.getByText("loading")).toBeInTheDocument();
    expect(
      screen.queryByText("_pages:aiAgents.apps.empty"),
    ).not.toBeInTheDocument();
  });

  it("shows a retryable error", () => {
    const props = renderSection([], { hasError: true });

    fireEvent.click(screen.getByText("_accessibility:errors.500"));
    expect(props.onRetry).toHaveBeenCalledOnce();
  });
});
