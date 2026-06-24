import type { UpdateDashboardCardConfigDto } from "lib";
import { isFiniteNumber, TransactionType, TransactionTypeResumeTime } from "lib";
import type {
  FilterTypeResumeConfigType,
  ToTypeResumeBatchRequestItemType,
  TypeResumeTypeFormType,
} from "./types";
import { DEFAULT_TYPE_RESUME_CONFIG } from "./constants";

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
      oppositeExcludedCategories: [],
      oppositeExcludedCategoryIds: normalizeExcludedCategoryIds(
        parsed.oppositeExcludedCategoryIds,
      ),
      showFiltersAsBadge:
        (parsed.showFiltersAsBadge as boolean | undefined) ??
        DEFAULT_TYPE_RESUME_CONFIG.showFiltersAsBadge,
      showOppositeType:
        (parsed.showOppositeType as boolean | undefined) ??
        DEFAULT_TYPE_RESUME_CONFIG.showOppositeType,
      compare:
        (parsed.compare as boolean | undefined) ??
        DEFAULT_TYPE_RESUME_CONFIG.compare,
    };
  } catch (err) {
    console.error(err);
    return DEFAULT_TYPE_RESUME_CONFIG;
  }
};

export const getActiveFiltersCount = (
  formConfig: TypeResumeTypeFormType,
): number => {
  const hasExcludedCategories =
    (formConfig.excludedCategoryIds?.length ?? 0) > 0;
  const hasOppositeExcludedCategories =
    formConfig.showOppositeType &&
    (formConfig.oppositeExcludedCategoryIds?.length ?? 0) > 0;

  return (
    2 +
    (formConfig.account ? 1 : 0) +
    (hasExcludedCategories ? 1 : 0) +
    (hasOppositeExcludedCategories ? 1 : 0)
  );
};

export const getPreviousTimeKey = (
  time?: TransactionTypeResumeTime,
): "CurrentDay" | "CurrentWeek" | "CurrentMonth" | "CurrentYear" => {
  switch (time) {
    case TransactionTypeResumeTime.CurrentDay:
      return "CurrentDay";
    case TransactionTypeResumeTime.CurrentWeek:
      return "CurrentWeek";
    case TransactionTypeResumeTime.CurrentYear:
      return "CurrentYear";
    case TransactionTypeResumeTime.CurrentMonth:
    case undefined:
    default:
      return "CurrentMonth";
  }
};

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

export const toTypeResumeBatchRequestItem: ToTypeResumeBatchRequestItemType = (
  cardId,
  data,
) => {
  const filterConfig = toTypeResumeFilterConfig(data);
  const oppositeExcludedCategoryIds = normalizeExcludedCategoryIds(
    data.oppositeExcludedCategoryIds,
  );

  return {
    cardId,
    ...filterConfig,
    includeOpposite: !!data.showOppositeType,
    ...(data.showOppositeType && oppositeExcludedCategoryIds.length
      ? { oppositeExcludedCategoryIds }
      : {}),
    ...(data.compare ? { compare: true } : {}),
  };
};

export const formToDto = (
  data: TypeResumeTypeFormType,
): UpdateDashboardCardConfigDto => {
  const excludedCategoryIds = normalizeExcludedCategoryIds(
    data.excludedCategoryIds,
  );
  const oppositeExcludedCategoryIds = normalizeExcludedCategoryIds(
    data.oppositeExcludedCategoryIds,
  );
  const stringified = JSON.stringify({
    account: data.account,
    type: data.type,
    time: data.time,
    showFiltersAsBadge: !!data.showFiltersAsBadge,
    showOppositeType: !!data.showOppositeType,
    compare: !!data.compare,
    ...(excludedCategoryIds.length ? { excludedCategoryIds } : {}),
    ...(data.showOppositeType && oppositeExcludedCategoryIds.length
      ? { oppositeExcludedCategoryIds }
      : {}),
  });
  return {
    userId: data.userId,
    id: data.id,
    config: stringified,
  };
};
