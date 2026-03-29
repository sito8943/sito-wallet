import { beforeEach, describe, expect, it, vi } from "vitest";

const storage = new Map<string, unknown>();

vi.mock("@sito/dashboard-app", () => ({
  fromLocal: (key: string) => storage.get(key) ?? null,
  toLocal: (key: string, value: unknown) => {
    storage.set(key, value);
  },
  removeFromLocal: (key: string) => {
    storage.delete(key);
  },
}));

vi.mock("../../../config", () => ({
  config: {
    tableOptions: "sito-wallet:table-options",
  },
}));

import { loadTableOptions, saveTableOptions } from "../persistedTableOptions";

const key = "sito-wallet:table-options:transactions:1";

describe("persistedTableOptions utils", () => {
  beforeEach(() => {
    storage.clear();
  });

  it("does not persist default ACTIVE softDeleteScope", () => {
    saveTableOptions("transactions", 1, {
      sortingBy: "id",
      sortingOrder: "DESC",
      filters: {},
    });

    expect(storage.get(key)).toEqual({
      sortingBy: "id",
      sortingOrder: "DESC",
      filters: {},
    });
  });

  it("keeps explicit non-default softDeleteScope values", () => {
    saveTableOptions("transactions", 1, {
      sortingBy: "id",
      sortingOrder: "DESC",
      filters: { softDeleteScope: "DELETED" },
    });

    expect(storage.get(key)).toEqual({
      sortingBy: "id",
      sortingOrder: "DESC",
      filters: { softDeleteScope: "DELETED" },
    });
  });

  it("strips legacy persisted ACTIVE softDeleteScope on load", () => {
    storage.set(key, {
      sortingBy: "id",
      sortingOrder: "DESC",
      filters: { softDeleteScope: "ACTIVE" },
    });

    expect(loadTableOptions("transactions", 1)).toEqual({
      sortingBy: "id",
      sortingOrder: "DESC",
      filters: {},
    });
  });
});
