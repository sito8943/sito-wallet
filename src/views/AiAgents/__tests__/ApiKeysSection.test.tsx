import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import type { ApiKeyDto } from "lib";
import { McpAccess } from "../../../lib/mcp/types";

vi.mock("lib", async () => ({
  ...(await import("../../../lib/mcp")),
  ...(await import("../../../lib/entities/apiKey/constants")),
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
  Button: ({
    children,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: string;
  }) => {
    const { variant, color, ...buttonProps } = rest as Record<string, unknown>;
    void variant;
    void color;
    return (
      <button
        {...(buttonProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  },
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

import { ApiKeysSection } from "../components/ApiKeysSection";

const buildKey = (
  id: number,
  lastUsedAt: string | null = null,
  access: McpAccess = McpAccess.Full,
): ApiKeyDto => ({
  id,
  name: `Key ${id}`,
  prefix: `swal_Key00${id}`,
  createdAt: "2026-11-01T10:00:00Z",
  lastUsedAt,
  access,
});

const renderSection = (apiKeys: ApiKeyDto[], hasError = false) => {
  const props = {
    apiKeys,
    isLoading: false,
    hasError,
    onRetry: vi.fn(),
    onCreate: vi.fn(),
    onRevoke: vi.fn(),
  };
  render(<ApiKeysSection {...props} />);
  return props;
};

describe("ApiKeysSection", () => {
  it("shows the empty state and lets the user create a key", () => {
    const props = renderSection([]);

    expect(screen.getByText("_pages:aiAgents.keys.empty")).toBeInTheDocument();
    fireEvent.click(screen.getByText("_pages:aiAgents.keys.create"));
    expect(props.onCreate).toHaveBeenCalledOnce();
  });

  it("lists keys with prefix and last use, and revokes one", () => {
    const used = buildKey(2, "2026-11-10T08:00:00Z");
    const props = renderSection([buildKey(1), used]);

    expect(screen.getByText("swal_Key001…")).toBeInTheDocument();
    expect(
      screen.getByText("_pages:aiAgents.keys.neverUsed"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/_pages:aiAgents.keys.lastUsed/),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByLabelText("_pages:aiAgents.keys.revokeAction: Key 2"),
    );
    expect(props.onRevoke).toHaveBeenCalledWith(used);
  });

  it("shows the access level of each key", () => {
    renderSection([
      buildKey(1),
      buildKey(2, null, McpAccess.Read),
      buildKey(3, null, McpAccess.Write),
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

  it("shows read and write for a key without a known access", () => {
    renderSection([buildKey(1, null, "UNKNOWN" as McpAccess)]);

    expect(
      screen.getByText("_pages:aiAgents.access.levels.full.label"),
    ).toBeInTheDocument();
  });

  it("disables creation at the 10 keys limit", () => {
    renderSection(
      Array.from({ length: 10 }, (_, index) => buildKey(index + 1)),
    );

    expect(
      screen.getByText("_pages:aiAgents.keys.create").closest("button"),
    ).toBeDisabled();
    expect(
      screen.getByText(/_pages:aiAgents.keys.limitReached/),
    ).toBeInTheDocument();
  });

  it("shows a retryable error", () => {
    const props = renderSection([], true);

    fireEvent.click(screen.getByText("_accessibility:errors.500"));
    expect(props.onRetry).toHaveBeenCalledOnce();
  });
});
