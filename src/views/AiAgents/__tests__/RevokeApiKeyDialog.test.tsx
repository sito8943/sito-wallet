import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@sito/dashboard-app", () => ({
  Dialog: ({ open, children }: { open?: boolean; children: ReactNode }) =>
    open ? <div role="dialog">{children}</div> : null,
  DialogActions: ({
    primaryText,
    cancelText,
    onCancel,
  }: {
    primaryText: string;
    cancelText: string;
    onCancel: () => void;
  }) => (
    <div>
      <button type="submit">{primaryText}</button>
      <button type="button" onClick={onCancel}>
        {cancelText}
      </button>
    </div>
  ),
}));

import { RevokeApiKeyDialog } from "../components/RevokeApiKeyDialog";

describe("RevokeApiKeyDialog", () => {
  it("names the action on the primary button, not a generic OK", () => {
    const handleClose = vi.fn();
    render(
      <RevokeApiKeyDialog
        open
        title="Revoke"
        target={{ id: 1, name: "Laptop" } as never}
        openForKey={vi.fn()}
        handleSubmit={vi.fn()}
        handleClose={handleClose}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "_pages:aiAgents.keys.revoke.confirm",
      }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "_accessibility:buttons.cancel" }),
    );
    expect(handleClose).toHaveBeenCalled();
  });
});
