import { describe, expect, it } from "vitest";

// local
import { resolveDashboardDropSide } from "./utils";

// lib
import type { DashboardDto } from "lib";

const buildItems = (ids: number[]): DashboardDto[] =>
  ids.map((id, index) => ({ id, position: index }) as DashboardDto);

describe("resolveDashboardDropSide", () => {
  const items = buildItems([1, 2, 3]);

  it("lands after the target when dragging forward", () => {
    expect(resolveDashboardDropSide(items, 1, 3)).toBe("after");
  });

  it("lands before the target when dragging backward", () => {
    expect(resolveDashboardDropSide(items, 3, 1)).toBe("before");
  });

  it("returns null without a target, for itself or for unknown ids", () => {
    expect(resolveDashboardDropSide(items, 1, null)).toBeNull();
    expect(resolveDashboardDropSide(items, 2, 2)).toBeNull();
    expect(resolveDashboardDropSide(items, 2, 99)).toBeNull();
  });
});
