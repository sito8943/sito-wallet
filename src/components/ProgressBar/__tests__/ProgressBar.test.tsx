import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@sito/dashboard-app", () => ({
  classNames: (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(" "),
}));

import { ProgressBar } from "../ProgressBar";
import { clampPercent } from "../utils";

describe("clampPercent", () => {
  it("keeps values inside 0–100", () => {
    expect(clampPercent(42.5)).toBe(42.5);
    expect(clampPercent(-10)).toBe(0);
    expect(clampPercent(250)).toBe(100);
  });

  it("treats invalid numbers as 0", () => {
    expect(clampPercent(Number.NaN)).toBe(0);
    expect(clampPercent(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe("ProgressBar", () => {
  it("exposes the clamped value and fills that width", () => {
    render(<ProgressBar value={130} label="Progress" />);

    const bar = screen.getByRole("progressbar", { name: "Progress" });
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    expect(bar.firstElementChild).toHaveStyle({ width: "100%" });
  });

  it("applies the variant modifier (primary by default)", () => {
    const { rerender } = render(<ProgressBar value={40} />);
    expect(screen.getByRole("progressbar").firstElementChild).toHaveClass(
      "progress-bar-fill--primary",
    );

    rerender(<ProgressBar value={40} variant="success" />);
    expect(screen.getByRole("progressbar").firstElementChild).toHaveClass(
      "progress-bar-fill--success",
    );
  });
});
