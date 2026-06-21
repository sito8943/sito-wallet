import type { SoftDeleteScope } from "@sito/dashboard-app";

const ACTIVE_SOFT_DELETE_SCOPE: SoftDeleteScope = "ACTIVE";
const ALL_SOFT_DELETE_SCOPE: SoftDeleteScope = "ALL";

export const applyHideDeletedEntitiesPreference = <TFilters extends object>(
  filters: TFilters,
  hideDeletedEntities?: boolean,
): TFilters => {
  const nextFilters = {
    ...filters,
    softDeleteScope: hideDeletedEntities
      ? ACTIVE_SOFT_DELETE_SCOPE
      : ALL_SOFT_DELETE_SCOPE,
  } as TFilters & {
    deletedAt?: unknown;
    softDeleteScope: SoftDeleteScope;
  };

  delete nextFilters.deletedAt;

  return nextFilters as TFilters;
};
