import type { ActionType, BaseEntityDto } from "@sito/dashboard-app";

/**
 * Products and purchase providers come from their `/common` endpoints, which
 * don't return `createdAt`/`deletedAt`. Cards and grids expect a full entity,
 * so items are adapted to this shape with `toCatalogRow`.
 */
export interface CatalogRowDto extends BaseEntityDto {
  name: string;
  /** Secondary line under the name (e.g. a product's receipt name). */
  subtitle?: string | null;
  photo?: string | null;
}

export type CatalogCommonItem = {
  id: number;
  name: string;
  updatedAt: Date;
  subtitle?: string | null;
  photo?: string | null;
};

export interface CatalogCardPropsType extends CatalogRowDto {
  actions: ActionType<CatalogRowDto>[];
  onClick: (id: number) => void;
  /** Shows the photo (or a placeholder) next to the name. */
  showPhoto?: boolean;
  editLabel: string;
  editAriaLabel: string;
  swipeDeleteOpen?: boolean;
  onSwipeDelete?: () => void;
}
