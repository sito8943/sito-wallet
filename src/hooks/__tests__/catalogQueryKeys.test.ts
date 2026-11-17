import { describe, expect, it } from "vitest";

import { ProductsQueryKeys } from "../queries/queryKeys/productsQueryKeys";
import { PurchaseProvidersQueryKeys } from "../queries/queryKeys/purchaseProvidersQueryKeys";

// Delete/restore invalidate `all()`, so the paged list and the /common picker
// query must both live under it.
describe.each([
  ["products", ProductsQueryKeys],
  ["purchase-providers", PurchaseProvidersQueryKeys],
] as const)("%s query keys", (root, keys) => {
  it("nest the paged list and the picker under the root key", () => {
    const list = keys.infiniteList(
      { pageSize: 20 },
      { softDeleteScope: "ALL" },
    ).queryKey;

    expect(keys.all().queryKey).toEqual([root]);
    expect(list.slice(0, 1)).toEqual([root]);
    expect(keys.common().queryKey.slice(0, 1)).toEqual([root]);
  });
});
