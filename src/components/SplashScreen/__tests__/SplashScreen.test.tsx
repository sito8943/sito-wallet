import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SplashScreen } from "../SplashScreen";
import { SPLASH_EXIT_MS, SPLASH_MIN_VISIBLE_MS } from "../constants";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@sito/dashboard-app", () => ({
  Loading: () => <div data-testid="loading" />,
  classNames: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

const getSplash = () => screen.queryByText("_pages:home.appName");

describe("SplashScreen", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("shows the app name and a spinner", () => {
    render(<SplashScreen />);

    expect(getSplash()).toBeInTheDocument();
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("stays up for the minimum time, then fades out and unmounts", () => {
    const { rerender, container } = render(<SplashScreen visible />);
    rerender(<SplashScreen visible={false} />);

    act(() => vi.advanceTimersByTime(SPLASH_MIN_VISIBLE_MS - 1));
    expect(container.firstChild).not.toHaveClass("exiting");

    act(() => vi.advanceTimersByTime(1));
    expect(container.firstChild).toHaveClass("exiting");

    act(() => vi.advanceTimersByTime(SPLASH_EXIT_MS));
    expect(getSplash()).toBeNull();
  });

  it("renders nothing when mounted hidden", () => {
    render(<SplashScreen visible={false} />);

    act(() => vi.advanceTimersByTime(SPLASH_MIN_VISIBLE_MS));
    expect(getSplash()).toBeNull();
  });
});
