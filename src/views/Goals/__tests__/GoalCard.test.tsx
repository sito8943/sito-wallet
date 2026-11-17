import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, values?: Record<string, unknown>) =>
      values ? `${key} ${JSON.stringify(values)}` : key,
    i18n: { language: "en-US" },
  }),
}));

vi.mock("@sito/dashboard-app", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  classNames: (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(" "),
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: ReactNode;
    onClick?: (event: { stopPropagation: () => void }) => void;
    disabled?: boolean;
  }) => (
    <button type="button" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock("components", () => ({
  ItemCard: ({
    title,
    children,
    onClick,
  }: {
    title: ReactNode;
    children: ReactNode;
    onClick?: () => void;
  }) => (
    <article data-testid="goal-card" onClick={onClick}>
      {title}
      {children}
    </article>
  ),
  ItemCardTitle: ({ children }: { children: ReactNode }) => <h3>{children}</h3>,
  ProgressBar: ({ value, variant }: { value: number; variant?: string }) => (
    <div role="progressbar" aria-valuenow={value} data-variant={variant} />
  ),
  EntityAvatar: ({ photo }: { photo?: string | null }) =>
    photo ? <img alt="" data-testid="goal-photo" src={photo} /> : null,
}));

import { GoalStatus } from "lib";

import { GoalCard } from "../components/GoalCard";
import { buildGoal, savingsAccount } from "./fixtures";
import type { GoalCardPropsType } from "../types";

const renderCard = (overrides: Partial<GoalCardPropsType> = {}) => {
  const onClick = vi.fn();
  const onComplete = vi.fn();
  render(
    <GoalCard
      {...buildGoal()}
      actions={[]}
      onClick={onClick}
      onComplete={onComplete}
      {...overrides}
    />,
  );
  return { onClick, onComplete };
};

describe("GoalCard", () => {
  it("shows progress, deadline countdown and monthly saving", () => {
    renderCard();

    expect(screen.getByRole("heading", { name: "Bike" })).toBeInTheDocument();
    expect(
      screen.getByText(
        /_pages:goals.labels.progress .*"saved":"125.00".*"target":"500.00".*"currency":"€"/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "25",
    );
    expect(
      screen.getByText(/_pages:goals.labels.daysLeft \{"count":47\}/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/_pages:goals.labels.monthlyNeeded/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("_pages:goals.actions.complete.text"),
    ).not.toBeInTheDocument();
  });

  it("shows the placeholder icon without photo", () => {
    renderCard();
    expect(screen.queryByTestId("goal-photo")).not.toBeInTheDocument();
  });

  it("renders the goal photo", () => {
    renderCard({ photo: "goals/1/photo" });
    expect(screen.getByTestId("goal-photo")).toHaveAttribute(
      "src",
      "goals/1/photo",
    );
  });

  it("shows the account chip when linked", () => {
    renderCard({ account: savingsAccount });
    expect(screen.getByText("Savings")).toBeInTheDocument();
  });

  it("marks overdue goals and hides the monthly saving when unknown", () => {
    renderCard({ daysLeft: -2, monthlyNeeded: null });

    expect(screen.getByText("_pages:goals.labels.overdue")).toBeInTheDocument();
    expect(
      screen.queryByText(/_pages:goals.labels.monthlyNeeded/),
    ).not.toBeInTheDocument();
  });

  it("offers to complete a reached active goal without opening the editor", () => {
    const goal = buildGoal({
      reached: true,
      saved: 500,
      progressPercent: 100,
      monthlyNeeded: null,
    });
    const { onClick, onComplete } = renderCard(goal);

    expect(screen.getByText("_pages:goals.labels.reached")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "data-variant",
      "success",
    );

    fireEvent.click(screen.getByText("_pages:goals.actions.complete.text"));

    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({ id: goal.id }),
    );
    expect(onClick).not.toHaveBeenCalled();
  });

  it("shows the status instead of the badge once completed", () => {
    renderCard({
      reached: true,
      status: GoalStatus.Completed,
      monthlyNeeded: null,
    });

    expect(
      screen.queryByText("_pages:goals.labels.reached"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("_entities:goal.status.values.COMPLETED"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/_pages:goals.labels.daysLeft/),
    ).not.toBeInTheDocument();
  });

  it("opens the editor when the card is clicked", () => {
    const { onClick } = renderCard();
    fireEvent.click(screen.getByTestId("goal-card"));
    expect(onClick).toHaveBeenCalledWith(1);
  });
});
