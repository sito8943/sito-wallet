import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("lib", async () => ({
  ...(await import("../../../lib/mcp")),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../components/CodeSnippet", () => ({
  CodeSnippet: () => null,
}));

vi.mock("../components/McpConnectorSteps", () => ({
  McpConnectorSteps: () => null,
}));

vi.mock("@sito/dashboard-app", () => ({
  TabsLayout: ({
    tabs,
    defaultTab,
  }: {
    tabs: { id: string; label: string }[];
    defaultTab: string;
  }) => (
    <div data-testid="tabs" data-default-tab={defaultTab}>
      {tabs.map((tab) => (
        <span key={tab.id} data-testid="tab">
          {tab.id}
        </span>
      ))}
    </div>
  ),
}));

import { McpClient } from "lib";

import { McpSetupInstructions } from "../components/McpSetupInstructions";
import { MCP_CONNECTOR_TAB } from "../constants";

const MCP_URL = "https://api.wallet.sito8943.com/mcp";

const tabIds = () => screen.getAllByTestId("tab").map((tab) => tab.textContent);

describe("McpSetupInstructions", () => {
  it("shows the ChatGPT / claude.ai connector tab first and selected", () => {
    render(<McpSetupInstructions mcpUrl={MCP_URL} />);

    expect(tabIds()[0]).toBe(MCP_CONNECTOR_TAB);
    expect(screen.getByTestId("tabs")).toHaveAttribute(
      "data-default-tab",
      MCP_CONNECTOR_TAB,
    );
  });

  it("defaults to the first snippet tab without the connector", () => {
    render(<McpSetupInstructions mcpUrl={MCP_URL} withConnector={false} />);

    expect(tabIds()).not.toContain(MCP_CONNECTOR_TAB);
    expect(tabIds()[0]).toBe(McpClient.ClaudeCode);
    expect(screen.getByTestId("tabs")).toHaveAttribute(
      "data-default-tab",
      McpClient.ClaudeCode,
    );
  });
});
