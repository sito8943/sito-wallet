import { describe, expect, it } from "vitest";

import { DashboardCardType } from "lib";

import { isDashboardCardEnabled } from "..";

const allOn = { subscriptionsEnabled: true, goalsEnabled: true };

describe("isDashboardCardEnabled", () => {
  it("follows the goals flag for the goals card", () => {
    expect(isDashboardCardEnabled(DashboardCardType.Goals, allOn)).toBe(true);
    expect(
      isDashboardCardEnabled(DashboardCardType.Goals, {
        ...allOn,
        goalsEnabled: false,
      }),
    ).toBe(false);
  });

  it("follows the subscriptions flag for the forecast card", () => {
    expect(
      isDashboardCardEnabled(DashboardCardType.SubscriptionForecast, {
        ...allOn,
        subscriptionsEnabled: false,
      }),
    ).toBe(false);
  });

  it("never offers the weekly spent card", () => {
    expect(isDashboardCardEnabled(DashboardCardType.WeeklySpent, allOn)).toBe(
      false,
    );
    expect(isDashboardCardEnabled(DashboardCardType.TypeResume, allOn)).toBe(
      true,
    );
  });
});
