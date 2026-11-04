import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import type { SharedCatalogDto } from "lib";

/**
 * `select` for catalog `/common` queries: drops other users' public items,
 * or (with `includeShared`) lists them after the caller's own, with the
 * owner in their name.
 */
export function useCatalogSelect<
  TItem extends SharedCatalogDto & { name: string },
>(includeShared: boolean) {
  const { t } = useTranslation();

  return useCallback(
    (items: TItem[]): TItem[] => {
      const own = items.filter((item) => !item.shared);
      if (!includeShared) return own;

      const shared = items
        .filter((item) => item.shared)
        .map((item) => ({
          ...item,
          name: t("_entities:catalog.sharedLabel", {
            name: item.name,
            owner: item.ownerName ?? "",
          }),
        }));
      return [...own, ...shared];
    },
    [includeShared, t],
  );
}
