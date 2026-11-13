import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { McpArea } from "../../../lib/mcp/types";

vi.mock("lib", async () => ({
  ...(await import("../../../lib/mcp")),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@sito/dashboard-app", () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

import { McpAreaSelector } from "../McpAreaSelector";

const checkbox = (key: string) =>
  screen.getByRole("checkbox", {
    name: new RegExp(`_pages:aiAgents.areas.items.${key}.label`),
  });

describe("McpAreaSelector", () => {
  it("shows every area, checking the selected ones", () => {
    render(
      <McpAreaSelector
        value={[McpArea.Transactions, McpArea.Debts]}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getAllByRole("checkbox")).toHaveLength(6);
    expect(checkbox("transactions")).toBeChecked();
    expect(checkbox("debts")).toBeChecked();
    expect(checkbox("currencies")).not.toBeChecked();
  });

  it("adds and removes areas in display order", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <McpAreaSelector value={[McpArea.Debts]} onChange={onChange} />,
    );

    fireEvent.click(checkbox("transactions"));
    expect(onChange).toHaveBeenLastCalledWith([
      McpArea.Transactions,
      McpArea.Debts,
    ]);

    rerender(
      <McpAreaSelector
        value={[McpArea.Transactions, McpArea.Debts]}
        onChange={onChange}
      />,
    );
    fireEvent.click(checkbox("debts"));
    expect(onChange).toHaveBeenLastCalledWith([McpArea.Transactions]);
  });

  it("selects every area", () => {
    const onChange = vi.fn();
    render(<McpAreaSelector value={[McpArea.Debts]} onChange={onChange} />);

    fireEvent.click(
      screen.getByRole("button", { name: /_pages:aiAgents.areas.selectAll/ }),
    );

    expect(onChange).toHaveBeenCalledWith([
      McpArea.Transactions,
      McpArea.Debts,
      McpArea.Subscriptions,
      McpArea.Accounts,
      McpArea.Categories,
      McpArea.Currencies,
    ]);
  });

  it("inverts the selection", () => {
    const onChange = vi.fn();
    render(
      <McpAreaSelector
        value={[McpArea.Transactions, McpArea.Debts]}
        onChange={onChange}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /_pages:aiAgents.areas.invert/ }),
    );

    expect(onChange).toHaveBeenCalledWith([
      McpArea.Subscriptions,
      McpArea.Accounts,
      McpArea.Categories,
      McpArea.Currencies,
    ]);
  });

  it("shows the error as an alert", () => {
    render(<McpAreaSelector value={[]} onChange={vi.fn()} error="Pick one" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Pick one");
  });
});
