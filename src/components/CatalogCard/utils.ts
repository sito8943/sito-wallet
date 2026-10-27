import type { CatalogCommonItem, CatalogRowDto } from "./types";

export const toCatalogRow = (item: CatalogCommonItem): CatalogRowDto => ({
  ...item,
  createdAt: item.updatedAt,
  deletedAt: null,
});
