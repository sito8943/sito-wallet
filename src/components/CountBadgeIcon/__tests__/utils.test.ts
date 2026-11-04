import { describe, expect, it } from "vitest";

import { formatBadgeCount } from "../utils";

describe("formatBadgeCount", () => {
  it("hides the badge without transactions", () => {
    expect(formatBadgeCount(undefined)).toBeNull();
    expect(formatBadgeCount(0)).toBeNull();
  });

  it("shows the count up to 99", () => {
    expect(formatBadgeCount(1)).toBe("1");
    expect(formatBadgeCount(99)).toBe("99");
  });

  it("caps at +99", () => {
    expect(formatBadgeCount(100)).toBe("+99");
    expect(formatBadgeCount(2090)).toBe("+99");
  });
});
