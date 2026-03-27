import { SoftDeleteScope } from "@sito/dashboard-app";

export type DateRangeFilterValue = {
  start?: string | Date | number;
  end?: string | Date | number;
};

type NormalizationMode = "list" | "common" | "hardDelete";

const SOFT_DELETE_SCOPES = new Set<SoftDeleteScope>([
  "ACTIVE",
  "DELETED",
  "ALL",
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseSoftDeleteScope = (value: unknown): SoftDeleteScope | undefined => {
  if (typeof value !== "string") return undefined;

  const normalized = value.trim().toUpperCase();
  if (!SOFT_DELETE_SCOPES.has(normalized as SoftDeleteScope)) return undefined;

  return normalized as SoftDeleteScope;
};

const parseLegacyStatusScope = (
  value: unknown,
): SoftDeleteScope | undefined => {
  if (typeof value === "boolean") {
    return value ? "DELETED" : "ACTIVE";
  }

  if (typeof value !== "string") return undefined;

  const normalized = value.trim().toUpperCase();

  if (normalized === "TRUE") return "DELETED";
  if (normalized === "FALSE") return "ACTIVE";

  return parseSoftDeleteScope(normalized);
};

const parseLegacyDeletedAtBooleanScope = (
  value: unknown,
): SoftDeleteScope | undefined => {
  if (typeof value === "boolean") {
    return value ? "DELETED" : "ACTIVE";
  }

  if (typeof value !== "string") return undefined;

  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return "DELETED";
  if (normalized === "false") return "ACTIVE";

  return undefined;
};

const parseRangeBoundary = (
  value: unknown,
): DateRangeFilterValue["start"] | undefined => {
  if (value instanceof Date) return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return undefined;

  const normalized = value.trim();
  return normalized.length ? normalized : undefined;
};

const parseDeletedAtRange = (
  value: unknown,
): DateRangeFilterValue | undefined => {
  if (!isRecord(value)) return undefined;

  const hasStart = Object.prototype.hasOwnProperty.call(value, "start");
  const hasEnd = Object.prototype.hasOwnProperty.call(value, "end");
  if (!hasStart && !hasEnd) return undefined;

  const start = parseRangeBoundary(value.start);
  const end = parseRangeBoundary(value.end);

  if (start === undefined && end === undefined) return undefined;

  return {
    ...(start !== undefined ? { start } : {}),
    ...(end !== undefined ? { end } : {}),
  };
};

const resolveSoftDeleteScope = (
  filters: Record<string, unknown>,
  mode: NormalizationMode,
): SoftDeleteScope | undefined => {
  const explicitScope = parseSoftDeleteScope(filters.softDeleteScope);
  const statusScope = parseLegacyStatusScope(filters.status);
  const deletedAtBooleanScope = parseLegacyDeletedAtBooleanScope(
    filters.deletedAt,
  );

  const resolvedScope = explicitScope ?? statusScope ?? deletedAtBooleanScope;
  if (mode === "list") return resolvedScope ?? "ACTIVE";

  return resolvedScope;
};

const normalizeFiltersByMode = (
  filters: unknown,
  mode: NormalizationMode,
): Record<string, unknown> => {
  const normalized = isRecord(filters) ? { ...filters } : {};
  const resolvedSoftDeleteScope = resolveSoftDeleteScope(normalized, mode);
  const deletedAtRange = parseDeletedAtRange(normalized.deletedAt);

  delete normalized.status;
  delete normalized.softDeleteScope;
  delete normalized.deletedAt;

  if (mode === "hardDelete") return normalized;

  if (mode === "list" && resolvedSoftDeleteScope) {
    normalized.softDeleteScope = resolvedSoftDeleteScope;
  }

  const shouldKeepDeletedAtRange =
    mode === "common" ||
    (mode === "list" && resolvedSoftDeleteScope === "DELETED");

  if (deletedAtRange && shouldKeepDeletedAtRange) {
    normalized.deletedAt = deletedAtRange;
  }

  return normalized;
};

export const normalizeListFilters = (
  filters?: unknown,
): Record<string, unknown> => normalizeFiltersByMode(filters, "list");

export const normalizeCommonFilters = (
  filters?: unknown,
): Record<string, unknown> => normalizeFiltersByMode(filters, "common");

export const normalizeHardDeleteFilters = (
  filters?: unknown,
): Record<string, unknown> => normalizeFiltersByMode(filters, "hardDelete");
