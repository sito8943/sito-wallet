import { describe, expect, it } from "vitest";

import type { ProductDto } from "lib";

import { productToCatalogRow } from "../utils";

const createdAt = new Date("2026-10-01T10:00:00Z");
const updatedAt = new Date("2026-10-02T10:00:00Z");

const product = (overrides: Partial<ProductDto> = {}): ProductDto => ({
  id: 3,
  name: "LECHE ENT. 1L",
  alias: "Leche",
  photo: "leche.jpg",
  transactionCount: 4,
  lastUnitPrice: 0.89,
  createdAt,
  updatedAt,
  deletedAt: null,
  ...overrides,
});

describe("productToCatalogRow", () => {
  it("shows the alias first and the receipt name below", () => {
    expect(productToCatalogRow(product())).toEqual({
      id: 3,
      name: "Leche",
      subtitle: "LECHE ENT. 1L",
      photo: "leche.jpg",
      transactionCount: 4,
      createdAt,
      updatedAt,
      deletedAt: null,
    });
  });

  it("uses the receipt name when there is no alias", () => {
    const row = productToCatalogRow(product({ alias: null }));

    expect(row.name).toBe("LECHE ENT. 1L");
    expect(row.subtitle).toBeNull();
  });

  it("keeps the deletion date", () => {
    const deletedAt = new Date("2026-11-01T10:00:00Z");

    expect(productToCatalogRow(product({ deletedAt })).deletedAt).toBe(
      deletedAt,
    );
  });
});
