import type { ActionType, BaseEntityDto } from "@sito/dashboard-app";

/**
 * Row shown by `CatalogCard` (products and purchase providers from their
 * paged lists). A set `deletedAt` renders the card as deleted.
 */
export interface CatalogRowDto extends BaseEntityDto {
  name: string;
  /** Secondary line under the name (e.g. a product's receipt name). */
  subtitle?: string | null;
  photo?: string | null;
  /** Shown as a badge on the "view transactions" action. */
  transactionCount?: number;
}

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
