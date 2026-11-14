import type { TFunction } from "i18next";
import { describe, expect, it, vi } from "vitest";

import { getRewardsRuleText } from "../utils";

const t = vi.fn(
  (key: string, options: { count: number; points: string; amount: string }) =>
    `${key}|${options.count}|${options.points}|${options.amount}`,
) as unknown as TFunction;

describe("getRewardsRuleText", () => {
  it("joins the spend unit with the currency symbol", () => {
    expect(getRewardsRuleText(t, "es", 10, 1, "€")).toBe(
      "_entities:account.rewards.rule|1|1|10 €",
    );
  });

  it("formats decimals in the locale and pluralizes on the points", () => {
    expect(getRewardsRuleText(t, "es", 2.5, 1.5, "€")).toBe(
      "_entities:account.rewards.rule|1.5|1,5|2,5 €",
    );
  });

  it("shows just the number without a currency", () => {
    expect(getRewardsRuleText(t, "en", 10, 1, null)).toBe(
      "_entities:account.rewards.rule|1|1|10",
    );
  });
});
