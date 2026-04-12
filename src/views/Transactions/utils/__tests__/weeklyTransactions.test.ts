import { describe, expect, it } from "vitest";

import { getWeeklyTransactionsDateRange } from "../weeklyTransactions";

describe("getWeeklyTransactionsDateRange", () => {
  it("returns the current weekly range using the last 7 complete days", () => {
    const now = new Date(2026, 3, 12, 10, 0, 0);

    expect(getWeeklyTransactionsDateRange("current", now)).toEqual({
      start: "2026-04-05T00:00:00",
      end: "2026-04-11T23:59:59",
    });
  });

  it("returns the previous weekly range", () => {
    const now = new Date(2026, 3, 12, 10, 0, 0);

    expect(getWeeklyTransactionsDateRange("previous", now)).toEqual({
      start: "2026-03-29T00:00:00",
      end: "2026-04-04T23:59:59",
    });
  });
});
