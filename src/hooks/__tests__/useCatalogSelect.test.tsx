import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, options: { name: string; owner: string }) =>
      `${options.name} · ${options.owner}`,
  }),
}));

const { useCatalogSelect } = await import("../queries/useCatalogSelect");

type Item = { id: number; name: string; shared?: boolean; ownerName?: string };

const items: Item[] = [
  { id: 1, name: "Shared milk", shared: true, ownerName: "Ana" },
  { id: 2, name: "Milk" },
  { id: 3, name: "Bread", shared: false },
];

describe("useCatalogSelect", () => {
  it("keeps only the user's own items by default", () => {
    const { result } = renderHook(() => useCatalogSelect<Item>(false));

    expect(result.current(items).map((item) => item.id)).toEqual([2, 3]);
  });

  it("lists shared items after own ones, with their owner", () => {
    const { result } = renderHook(() => useCatalogSelect<Item>(true));

    expect(result.current(items)).toEqual([
      { id: 2, name: "Milk" },
      { id: 3, name: "Bread", shared: false },
      { id: 1, name: "Shared milk · Ana", shared: true, ownerName: "Ana" },
    ]);
  });
});
