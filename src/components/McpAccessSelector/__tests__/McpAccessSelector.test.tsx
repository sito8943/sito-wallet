import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { McpAccess } from "../../../lib/mcp/types";

vi.mock("lib", async () => ({
  ...(await import("../../../lib/mcp")),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { McpAccessSelector } from "../McpAccessSelector";

const radio = (key: string) =>
  screen.getByRole("radio", {
    name: new RegExp(`_pages:aiAgents.access.levels.${key}.label`),
  });

describe("McpAccessSelector", () => {
  it("shows the three levels with their explanation, checking the value", () => {
    render(<McpAccessSelector value={McpAccess.Read} onChange={vi.fn()} />);

    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(radio("read")).toBeChecked();
    expect(radio("full")).not.toBeChecked();
    expect(
      screen.getByText("_pages:aiAgents.access.levels.write.description"),
    ).toBeInTheDocument();
  });

  it("reports the chosen level", () => {
    const onChange = vi.fn();
    render(<McpAccessSelector value={McpAccess.Full} onChange={onChange} />);

    fireEvent.click(radio("write"));

    expect(onChange).toHaveBeenCalledWith(McpAccess.Write);
  });

  it("locks every option when disabled", () => {
    render(
      <McpAccessSelector value={McpAccess.Full} onChange={vi.fn()} disabled />,
    );

    for (const option of screen.getAllByRole("radio"))
      expect(option).toBeDisabled();
  });
});
