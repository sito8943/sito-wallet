import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

vi.mock("@use-gesture/react", () => ({
  useDrag: () => () => ({}),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@sito/dashboard-app", () => ({
  classNames: (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(" "),
  Actions: () => null,
}));

vi.mock("../../EntityAvatar", () => ({
  EntityAvatar: () => null,
}));

import { CatalogCard } from "../CatalogCard";

const baseProps = {
  id: 7,
  name: "Leche",
  actions: [],
  editLabel: "edit",
  editAriaLabel: "edit Leche",
  createdAt: new Date("2026-10-01T10:00:00Z"),
  updatedAt: new Date("2026-10-01T10:00:00Z"),
};

describe("CatalogCard", () => {
  it("opens the editor for an active item", () => {
    const onClick = vi.fn();
    const { container } = render(
      <CatalogCard {...baseProps} deletedAt={null} onClick={onClick} />,
    );

    expect(container.querySelector(".item-card--deleted")).toBeNull();
    fireEvent.click(screen.getByText("Leche"));
    expect(onClick).toHaveBeenCalledWith(7);
  });

  it("shows a deleted item as deleted and does not open the editor", () => {
    const onClick = vi.fn();
    const { container } = render(
      <CatalogCard
        {...baseProps}
        deletedAt={new Date("2026-11-01T10:00:00Z")}
        onClick={onClick}
      />,
    );

    expect(container.querySelector(".item-card--deleted")).not.toBeNull();
    expect(screen.getByText("Leche")).toHaveClass("item-card-title--deleted");
    fireEvent.click(screen.getByText("Leche"));
    expect(onClick).not.toHaveBeenCalled();
  });
});
