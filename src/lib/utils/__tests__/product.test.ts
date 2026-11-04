import { describe, expect, it } from "vitest";

import { getProductLabel, withProductLabel } from "../product";

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

describe("withProductLabel", () => {
  it("returns the same labeled object for the same product", () => {
    const product = { id: 1, name: "PAN", alias: "Pan" };
    const labeled = withProductLabel(product);
    expect(labeled).toEqual({ id: 1, name: "Pan (PAN)", alias: "Pan" });
    expect(withProductLabel(product)).toBe(labeled);
    expect(withProductLabel({ ...product })).not.toBe(labeled);
  });
});
