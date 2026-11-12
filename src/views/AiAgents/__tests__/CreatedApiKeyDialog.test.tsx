import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

vi.mock("lib", async () => ({
  ...(await import("../../../lib/mcp")),
  ...(await import("../../../lib/entities/apiKey/constants")),
  ...(await import("../../../lib/utils/date")),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("hooks", () => ({
  useCopyToClipboard: () => vi.fn(),
}));

vi.mock("@sito/dashboard-app", () => ({
  Dialog: ({ open, children }: { open: boolean; children: ReactNode }) =>
    open ? <div role="dialog">{children}</div> : null,
  Button: ({
    children,
    onClick,
  }: {
    children: ReactNode;
    onClick: () => void;
  }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
  IconButton: ({ "aria-label": ariaLabel }: { "aria-label"?: string }) => (
    <button type="button" aria-label={ariaLabel} />
  ),
  classNames: (...values: unknown[]) => values.filter(Boolean).join(" "),
  TabsLayout: ({ tabs }: { tabs: { id: string; content: ReactNode }[] }) => (
    <div>
      {tabs.map((tab) => (
        <div key={tab.id}>{tab.content}</div>
      ))}
    </div>
  ),
}));

import { CreatedApiKeyDialog } from "../components/CreatedApiKeyDialog";

const KEY = "swal_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQ";
const MCP_URL = "https://api.wallet.sito8943.com/mcp";

describe("CreatedApiKeyDialog", () => {
  it("is hidden without a created key", () => {
    render(
      <CreatedApiKeyDialog
        createdKey={null}
        mcpUrl={MCP_URL}
        handleClose={vi.fn()}
      />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the full key once with the warning and filled snippets", () => {
    render(
      <CreatedApiKeyDialog
        createdKey={{
          id: 1,
          name: "Laptop",
          prefix: "swal_abcdef",
          createdAt: "2026-11-12T10:00:00Z",
          lastUsedAt: null,
          key: KEY,
        }}
        mcpUrl={MCP_URL}
        handleClose={vi.fn()}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "_pages:aiAgents.keys.created.warning",
    );
    expect(screen.getByText(KEY)).toBeInTheDocument();

    const snippets = screen
      .getAllByText((_, element) => element?.tagName === "CODE")
      .map((element) => element.textContent ?? "");
    // key + Claude Code + Codex + Claude Desktop
    expect(snippets).toHaveLength(4);
    for (const snippet of snippets.slice(1)) {
      expect(snippet).toContain(KEY);
      expect(snippet).toContain(MCP_URL);
      expect(snippet).not.toContain("swal_...");
    }
  });
});
