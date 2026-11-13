import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import type { FeedbackDto } from "lib";

vi.mock("lib", async () => ({
  ...(await import("../../../lib/utils/date")),
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

import { FeedbackSection } from "../components/FeedbackSection";

const buildEntry = (
  id: number,
  overrides: Partial<FeedbackDto> = {},
): FeedbackDto => ({
  id,
  kind: "BUG",
  text: `Entry ${id}`,
  user: { id: 7, username: "ana", email: "ana@example.com" },
  account: null,
  source: "KEY",
  createdAt: `2026-11-0${id}T10:00:00`,
  resolvedAt: null,
  ...overrides,
});

const renderSection = (
  entries: FeedbackDto[],
  options: { hasError?: boolean; isLoading?: boolean } = {},
) => {
  const props = {
    entries,
    isLoading: options.isLoading ?? false,
    hasError: options.hasError ?? false,
    onRetry: vi.fn(),
    onToggleResolved: vi.fn(),
    pendingId: null,
  };
  render(<FeedbackSection {...props} />);
  return props;
};

describe("FeedbackSection", () => {
  it("shows the empty state", () => {
    renderSection([]);

    expect(screen.getByText("_pages:feedback.empty")).toBeInTheDocument();
    expect(
      screen.queryByText(/_pages:feedback.showResolved/),
    ).not.toBeInTheDocument();
  });

  it("lists open entries with their meta and resolves one", () => {
    const withAccount = buildEntry(2, {
      kind: "IDEA",
      source: "APP",
      account: { id: 3, name: "Savings" },
    });
    const props = renderSection([buildEntry(1), withAccount]);

    expect(screen.getByText(/_pages:feedback.openCount/)).toHaveTextContent(
      '"count":2',
    );
    expect(screen.getByText("Entry 2")).toBeInTheDocument();
    expect(screen.getByText("_pages:feedback.kinds.idea")).toBeInTheDocument();
    expect(screen.getByText("_pages:feedback.sources.app")).toBeInTheDocument();
    expect(screen.getByText(/"name":"Savings"/)).toBeInTheDocument();
    expect(screen.getAllByText(/"username":"ana"/)).toHaveLength(2);

    fireEvent.click(
      screen.getByLabelText(
        "_pages:feedback.resolveAction: _pages:feedback.kinds.idea #2",
      ),
    );
    expect(props.onToggleResolved).toHaveBeenCalledWith(withAccount);
  });

  it("hides resolved entries behind a toggle", () => {
    const resolved = buildEntry(2, { resolvedAt: "2026-11-05T10:00:00" });
    const props = renderSection([buildEntry(1), resolved]);

    expect(screen.queryByText("Entry 2")).not.toBeInTheDocument();

    const toggle = screen.getByText(/_pages:feedback.showResolved/);
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(toggle);

    expect(screen.getByText("Entry 2")).toBeInTheDocument();
    expect(screen.getByText("_pages:feedback.hideResolved")).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    fireEvent.click(
      screen.getByLabelText(
        "_pages:feedback.reopenAction: _pages:feedback.kinds.bug #2",
      ),
    );
    expect(props.onToggleResolved).toHaveBeenCalledWith(resolved);
  });

  it("notes when everything is resolved", () => {
    renderSection([buildEntry(1, { resolvedAt: "2026-11-05T10:00:00" })]);

    expect(screen.getByText("_pages:feedback.allResolved")).toBeInTheDocument();
    expect(screen.queryByText("Entry 1")).not.toBeInTheDocument();
  });

  it("shows a retryable error", () => {
    const props = renderSection([], { hasError: true });

    fireEvent.click(screen.getByText("_accessibility:errors.500"));
    expect(props.onRetry).toHaveBeenCalledOnce();
  });
});
