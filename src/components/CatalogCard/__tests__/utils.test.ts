import { describe, expect, it } from "vitest";

import { toCatalogRow } from "../utils";

describe("toCatalogRow", () => {
  it("completes a common item as a non-deleted entity", () => {
    const updatedAt = new Date("2026-10-26T10:00:00Z");

    expect(
      toCatalogRow({ id: 1, name: "Vivari", updatedAt, photo: "a.jpg" }),
    ).toEqual({
      id: 1,
      name: "Vivari",
      photo: "a.jpg",
      updatedAt,
      createdAt: updatedAt,
      deletedAt: null,
    });
  });
});
