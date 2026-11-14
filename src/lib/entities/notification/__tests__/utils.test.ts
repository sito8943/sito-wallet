import { describe, expect, it } from "vitest";

import { getNotificationTranslationValues } from "../utils";

describe("getNotificationTranslationValues", () => {
  it("formats the goal deadline reminder payload", () => {
    const values = getNotificationTranslationValues(
      {
        goalId: 3,
        goalName: "Bike",
        deadline: "2026-12-01",
        daysLeft: 7,
        remaining: 1234.5,
        currencySymbol: "€",
      },
      "en-US",
    );

    expect(values.goalName).toBe("Bike");
    expect(values.currencySymbol).toBe("€");
    expect(values.remainingFormatted).toBe("1,234.50");
    // Local date: no shift to the previous day west of UTC.
    expect(values.deadlineFormatted).toBe("Dec 1, 2026");
  });

  it("leaves the goal values undefined when missing or invalid", () => {
    const values = getNotificationTranslationValues(
      { deadline: "soon", remaining: "a lot" },
      "en-US",
    );

    expect(values.deadlineFormatted).toBeUndefined();
    expect(values.remainingFormatted).toBeUndefined();
  });
});
