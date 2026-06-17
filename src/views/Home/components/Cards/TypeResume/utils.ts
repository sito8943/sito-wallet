import type { UpdateDashboardCardConfigDto } from "lib";
import { TransactionType, TransactionTypeResumeTime } from "lib";
import type {
  FilterTypeResumeConfigType,
  TypeResumeTypeFormType,
} from "./types";
import { DEFAULT_TYPE_RESUME_CONFIG } from "./constants";

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const normalizeExcludedCategoryIds = (value: unknown): number[] => {
  if (!Array.isArray(value)) return [];

  return [...new Set(value.map(Number).filter(isFiniteNumber))].sort(
    (left, right) => left - right,
  );
};

export const parseFormConfig = (
  cfg?: string | null,
): TypeResumeTypeFormType => {
  try {
    const parsed = cfg ? (JSON.parse(cfg) as Record<string, unknown>) : {};
    const legacyAccounts = Array.isArray(parsed.accounts)
      ? (parsed.accounts as NonNullable<TypeResumeTypeFormType["account"]>[])
      : [];

    return {
      account:
        (parsed.account as TypeResumeTypeFormType["account"]) ??
        legacyAccounts[0],
      type: Number(
        parsed.type ?? DEFAULT_TYPE_RESUME_CONFIG.type,
      ) as TransactionType,
      time:
        (parsed.time as TypeResumeTypeFormType["time"]) ??
        DEFAULT_TYPE_RESUME_CONFIG.time,
      excludedCategories: [],
      excludedCategoryIds: normalizeExcludedCategoryIds(
        parsed.excludedCategoryIds,
      ),
      showFiltersAsBadge:
        (parsed.showFiltersAsBadge as boolean | undefined) ??
        DEFAULT_TYPE_RESUME_CONFIG.showFiltersAsBadge,
      showOppositeType:
        (parsed.showOppositeType as boolean | undefined) ??
        DEFAULT_TYPE_RESUME_CONFIG.showOppositeType,
    };
  } catch (err) {
    console.error(err);
    return DEFAULT_TYPE_RESUME_CONFIG;
  }
};

export const getActiveFiltersCount = (
  formConfig: TypeResumeTypeFormType,
): number =>
  2 +
  (formConfig.account ? 1 : 0) +
  ((formConfig.excludedCategoryIds?.length ?? 0) > 0 ? 1 : 0);

export const getOppositeTransactionType = (
  type: TransactionType,
): TransactionType =>
  type === TransactionType.In ? TransactionType.Out : TransactionType.In;

export const toTypeResumeFilterConfig = (
  data: TypeResumeTypeFormType,
): FilterTypeResumeConfigType => {
  const excludedCategoryIds = normalizeExcludedCategoryIds(
    data.excludedCategoryIds,
  );

  return {
    accountId: data.account?.id,
    type: data.type ?? TransactionType.In,
    time: data.time ?? TransactionTypeResumeTime.CurrentMonth,
    ...(excludedCategoryIds.length ? { excludedCategoryIds } : {}),
  };
};

export const formToDto = (
  data: TypeResumeTypeFormType,
): UpdateDashboardCardConfigDto => {
  const excludedCategoryIds = normalizeExcludedCategoryIds(
    data.excludedCategoryIds,
  );
  const stringified = JSON.stringify({
    account: data.account,
    type: data.type,
    time: data.time,
    showFiltersAsBadge: !!data.showFiltersAsBadge,
    showOppositeType: !!data.showOppositeType,
    ...(excludedCategoryIds.length ? { excludedCategoryIds } : {}),
  });
  return {
    userId: data.userId,
    id: data.id,
    config: stringified,
  };
};
