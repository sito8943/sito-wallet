import type { FilterDebtDto } from "./FilterDebtDto";
import { DEBT_STATUSES, type DebtStatus } from "./DebtStatus";

import { normalizeListFilters } from "../../utils/filterNormalization";

const parseDebtStatus = (value: unknown): DebtStatus | undefined => {
  let parsed = Number.NaN;
  if (typeof value === "number") parsed = value;
  if (typeof value === "string" && value.trim().length > 0) {
    parsed = Number(value);
  }

  if (!Number.isInteger(parsed)) return undefined;

  return DEBT_STATUSES.includes(parsed) ? parsed : undefined;
};

const parseDebtStatusFilter = (value: unknown): DebtStatus[] | undefined => {
  const values = Array.isArray(value) ? value : [value];
  const statuses = values
    .map(parseDebtStatus)
    .filter((status): status is DebtStatus => status !== undefined);

  return statuses.length > 0 ? [...new Set(statuses)] : undefined;
};

export const normalizeDebtListFilters = (filters?: unknown): FilterDebtDto => {
  if (
    typeof filters !== "object" ||
    filters === null ||
    Array.isArray(filters)
  ) {
    return normalizeListFilters(filters);
  }

  const filtersRecord = { ...(filters as Record<string, unknown>) };
  const status = parseDebtStatusFilter(filtersRecord.status);

  if (status !== undefined) {
    delete filtersRecord.status;
  }

  const normalized = normalizeListFilters(filtersRecord) as FilterDebtDto;
  if (status !== undefined) normalized.status = status;

  return normalized;
};
