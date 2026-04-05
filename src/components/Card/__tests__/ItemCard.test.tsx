import { describe, it, expect, vi, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@sito/dashboard-app", () => ({
  Actions: ({ actions }: { actions: unknown[] }) => (
    <div data-testid="actions-count">{actions.length}</div>
  ),
}));

import { ItemCard } from "../ItemCard";

const defaultAction = {
  id: "edit",
  tooltip: "Edit",
  icon: <span>*</span>,
  onClick: () => undefined,
};

afterEach(() => {
  vi.useRealTimers();
});

describe("ItemCard", () => {
  it("calls onClick when clicking a normal card", () => {
    const onClick = vi.fn();

    render(
      <ItemCard
        title="Title"
        name="Edit item"
        deleted={false}
        onClick={onClick}
        actions={[defaultAction]}
      >
        <span>Content</span>
      </ItemCard>,
    );

    fireEvent.click(screen.getByText("Content"));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("actions-count")).toHaveTextContent("1");
  });

  it("toggles selection and hides actions in selection mode", () => {
    const onClick = vi.fn();
    const onToggleSelection = vi.fn();

    render(
      <ItemCard
        title="Title"
        name="Edit item"
        deleted={false}
        onClick={onClick}
        onToggleSelection={onToggleSelection}
        selectionMode
        actions={[defaultAction]}
      >
        <span>Content</span>
      </ItemCard>,
    );

    fireEvent.click(screen.getByText("Content"));

    expect(onToggleSelection).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByTestId("actions-count")).toHaveTextContent("0");
  });

  it("fires long press callback and ignores follow-up click", () => {
    vi.useFakeTimers();

    const onClick = vi.fn();
    const onLongPressSelection = vi.fn();

    render(
      <ItemCard
        title="Title"
        name="Edit item"
        deleted={false}
        onClick={onClick}
        onLongPressSelection={onLongPressSelection}
        actions={[defaultAction]}
      >
        <span>Content</span>
      </ItemCard>,
    );

    const content = screen.getByText("Content");

    fireEvent.touchStart(content);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    fireEvent.touchEnd(content);
    fireEvent.click(content);

    expect(onLongPressSelection).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });
});
