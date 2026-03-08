import { describe, expect, it } from "vitest";

import { matchesFilterValue } from "../IndexedDBClient";

describe("IndexedDBClient", () => {
  it("treats deletedAt=false as records with null deletedAt", async () => {
    expect(matchesFilterValue("deletedAt", null, false)).toBe(true);
    expect(matchesFilterValue("deletedAt", undefined, false)).toBe(true);
    expect(
      matchesFilterValue("deletedAt", "2026-03-08T20:39:33.590938", false),
    ).toBe(false);
  });

  it("treats deletedAt=true as records with a deletion timestamp", async () => {
    expect(matchesFilterValue("deletedAt", null, true)).toBe(false);
    expect(matchesFilterValue("deletedAt", undefined, true)).toBe(false);
    expect(
      matchesFilterValue("deletedAt", "2026-03-08T20:39:33.590938", true),
    ).toBe(true);
  });

  it("keeps strict equality for non-deletedAt filters", () => {
    expect(matchesFilterValue("name", "CUP", "CUP")).toBe(true);
    expect(matchesFilterValue("name", "CUP", "EUR")).toBe(false);
    expect(matchesFilterValue("name", "CUP", undefined)).toBe(true);
  });
});
