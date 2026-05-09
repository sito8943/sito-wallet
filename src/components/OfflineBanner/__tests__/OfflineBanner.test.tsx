import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const mockUseOnlineStatus = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("hooks", () => ({
  useOnlineStatus: () => mockUseOnlineStatus(),
}));

vi.mock("@sito/dashboard-app", () => ({
  OfflineBanner: ({
    isOnline,
    message,
    className,
  }: {
    isOnline?: boolean;
    message?: string;
    className?: string;
  }) =>
    isOnline ? null : (
      <div role="status" className={className}>
        {message}
      </div>
    ),
}));

import { OfflineBanner } from "../OfflineBanner";

describe("OfflineBanner", () => {
  it("does not render while online", () => {
    mockUseOnlineStatus.mockReturnValue(true);

    render(<OfflineBanner />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders while browser is offline", () => {
    mockUseOnlineStatus.mockReturnValue(false);

    render(<OfflineBanner />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      screen.getByText("_accessibility:offline.banner"),
    ).toBeInTheDocument();
  });

  it("renders when offline mode is forced", () => {
    mockUseOnlineStatus.mockReturnValue(true);

    render(<OfflineBanner forceVisible />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
