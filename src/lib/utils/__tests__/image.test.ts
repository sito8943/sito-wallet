import { describe, expect, it } from "vitest";

import { getScaledSize } from "../image";

describe("getScaledSize", () => {
  it("fits the longest side and keeps the ratio", () => {
    expect(getScaledSize(3000, 4000, 2000)).toEqual({
      width: 1500,
      height: 2000,
    });
  });

  it("never upscales", () => {
    expect(getScaledSize(800, 600, 2000)).toEqual({ width: 800, height: 600 });
  });
});
