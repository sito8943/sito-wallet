import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const setSortingBy = vi.fn();
const setSortingOrder = vi.fn();
const loadTableOptions = vi.fn();

vi.mock("@sito/dashboard-app", () => ({
  useTableOptions: () => ({
    filters: {},
    sortingBy: "id",
    sortingOrder: "DESC",
    setSortingBy,
    setSortingOrder,
    onFilterApply: vi.fn(),
    clearFilters: vi.fn(),
    setCurrentPage: vi.fn(),
  }),
}));

vi.mock("lib", () => ({
  DEFAULT_TABLE_SORTING: { sortingBy: "id", sortingOrder: "DESC" },
  TABLE_PROVIDER_SORTING_BY: "id",
  saveTableOptions: vi.fn(),
  loadTableOptions: (...args: unknown[]) => loadTableOptions(...args),
}));

import { usePersistedTableOptions } from "../usePersistedTableOptions";

const DATE_DESC = { sortingBy: "date", sortingOrder: "DESC" };

describe("usePersistedTableOptions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses the view default when nothing is saved", () => {
    loadTableOptions.mockReturnValue(null);
    renderHook(() => usePersistedTableOptions("transactions", 1, DATE_DESC));
    expect(setSortingBy).toHaveBeenCalledWith("date");
    expect(setSortingOrder).toHaveBeenCalledWith("DESC");
  });

  it("treats a saved provider default (id) as not picked", () => {
    loadTableOptions.mockReturnValue({
      sortingBy: "id",
      sortingOrder: "ASC",
      filters: {},
    });
    renderHook(() => usePersistedTableOptions("transactions", 1, DATE_DESC));
    expect(setSortingBy).toHaveBeenCalledWith("date");
    expect(setSortingOrder).toHaveBeenCalledWith("DESC");
  });

  it("keeps a sorting the user picked", () => {
    loadTableOptions.mockReturnValue({
      sortingBy: "amount",
      sortingOrder: "ASC",
      filters: {},
    });
    renderHook(() => usePersistedTableOptions("transactions", 1, DATE_DESC));
    expect(setSortingBy).toHaveBeenCalledWith("amount");
    expect(setSortingOrder).toHaveBeenCalledWith("ASC");
  });
});
