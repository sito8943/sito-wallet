/**
 * Catalog items (`/common`) can belong to another user who made their
 * catalogs public. Using one makes the backend clone it into the caller's
 * account.
 */
export interface SharedCatalogDto {
  /** Belongs to another user. */
  shared?: boolean;
  /** Owner's name for shared items; null for the caller's own. */
  ownerName?: string | null;
}
