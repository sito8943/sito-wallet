import type { SoftDeleteScope } from "@sito/dashboard-app";

const ACTIVE_SOFT_DELETE_SCOPE: SoftDeleteScope = "ACTIVE";

export const applyHideDeletedEntitiesPreference = <TFilters extends object>(
  filters: TFilters,
  hideDeletedEntities?: boolean,
): TFilters => {
  if (!hideDeletedEntities) return filters;

  const nextFilters = {
    ...filters,
    softDeleteScope: ACTIVE_SOFT_DELETE_SCOPE,
  } as TFilters & {
    deletedAt?: unknown;
    softDeleteScope: SoftDeleteScope;
  };

  delete nextFilters.deletedAt;

  return nextFilters as TFilters;
};
