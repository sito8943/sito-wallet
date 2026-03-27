import { SoftDeleteScope } from "@sito/dashboard-app";

type FiltersRecord = Record<string, unknown>;

const ACTIVE_SOFT_DELETE_SCOPE: SoftDeleteScope = "ACTIVE";

export const applyHideDeletedEntitiesPreference = <
  TFilters extends FiltersRecord,
>(
  filters: TFilters,
  hideDeletedEntities?: boolean,
): TFilters => {
  if (!hideDeletedEntities) return filters;

  const nextFilters = {
    ...filters,
    softDeleteScope: ACTIVE_SOFT_DELETE_SCOPE,
  } as FiltersRecord;

  delete nextFilters.deletedAt;

  return nextFilters as TFilters;
};
