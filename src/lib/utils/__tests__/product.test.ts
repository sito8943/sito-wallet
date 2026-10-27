import { describe, expect, it } from "vitest";

import { getProductLabel } from "../product";

describe("getProductLabel", () => {
  it("shows the alias first and keeps the receipt name searchable", () => {
    expect(
      getProductLabel({ name: "LECHE ENTERA HACENDADO", alias: "Leche" }),
    ).toBe("Leche (LECHE ENTERA HACENDADO)");
  });

  it("falls back to the name without alias", () => {
    expect(getProductLabel({ name: "PAN", alias: null })).toBe("PAN");
    expect(getProductLabel({ name: "PAN" })).toBe("PAN");
  });
});
