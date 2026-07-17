import { describe, expect, it } from "vitest";

import { DebtStatus } from "./DebtStatus";
import { normalizeDebtListFilters } from "./normalizeDebtListFilters";

describe("normalizeDebtListFilters", () => {
  it("preserves valid debt statuses", () => {
    expect(
      normalizeDebtListFilters({
        status: [DebtStatus.Open, DebtStatus.PartiallyPaid],
        counterpartyName: "Ada",
      }),
    ).toEqual({
      status: [DebtStatus.Open, DebtStatus.PartiallyPaid],
      counterpartyName: "Ada",
      softDeleteScope: "ACTIVE",
    });
  });

  it("normalizes a single debt status as a list", () => {
    expect(normalizeDebtListFilters({ status: DebtStatus.Paid })).toEqual({
      status: [DebtStatus.Paid],
      softDeleteScope: "ACTIVE",
    });
  });

  it("keeps legacy boolean status handling for soft deletion", () => {
    expect(normalizeDebtListFilters({ status: true })).toEqual({
      softDeleteScope: "DELETED",
    });
  });
});
