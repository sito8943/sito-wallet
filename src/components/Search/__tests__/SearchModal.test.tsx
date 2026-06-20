import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@sito/dashboard-app", () => ({
  Dialog: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("components", () => ({
  SearchWrapper: () => <div data-testid="search-wrapper" />,
}));

import { SearchModal } from "../SearchModal";

function SearchModalHarness({ onClose }: { onClose: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <button type="button" onClick={() => navigate("/debts/new")}>
        Navigate
      </button>
      {location.pathname !== "/" ? (
        <SearchModal open onClose={onClose} />
      ) : null}
    </>
  );
}

describe("SearchModal", () => {
  it("closes stale modal state when navigating from home", () => {
    const onClose = vi.fn();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <SearchModalHarness onClose={onClose} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Navigate" }));

    expect(onClose).toHaveBeenCalledOnce();
  });
});
