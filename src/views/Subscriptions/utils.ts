import type { MoneyCurrencyType } from "components";
import type {
  AddSubscriptionBillingLogDto,
  AddSubscriptionDto,
  CommonTransactionCategoryDto,
  SubscriptionBillingLogDto,
  SubscriptionBillingUnit,
  SubscriptionDto,
  SubscriptionStatus,
  UpdateSubscriptionBillingLogDto,
  UpdateSubscriptionDto,
} from "lib";
import {
  formatAmount,
  formatDateTime,
  normalizeSelectedTransactionCategories,
  nowDateTimeLocal,
  parseFiniteNumber,
  parseOptionalDateTimeLocal,
  SUBSCRIPTION_BILLING_UNITS,
  SUBSCRIPTION_STATUSES,
  toDateTimeLocal,
} from "lib";

import {
  DEFAULT_SUBSCRIPTION_BILLING_UNIT,
  DEFAULT_SUBSCRIPTION_STATUS,
  LEGACY_SUBSCRIPTION_BILLING_UNIT_BY_CODE,
  LEGACY_SUBSCRIPTION_STATUS_BY_CODE,
} from "./constants";
import type {
  SubscriptionBillingLogFormType,
  SubscriptionFormType,
} from "./types";

const parseOptionalFiniteNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" && value.trim().length === 0) return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const isSubscriptionBillingUnit = (
  value: unknown,
): value is SubscriptionBillingUnit => {
  return (
    typeof value === "string" &&
    SUBSCRIPTION_BILLING_UNITS.includes(value as SubscriptionBillingUnit)
  );
};

const isSubscriptionStatus = (value: unknown): value is SubscriptionStatus => {
  return (
    typeof value === "string" &&
    SUBSCRIPTION_STATUSES.includes(value as SubscriptionStatus)
  );
};

const toLegacyCode = (value: unknown): number | null => {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && value.trim().length === 0) return null;

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
};

const parseSubscriptionCategories = (
  dto: SubscriptionDto,
): CommonTransactionCategoryDto[] => {
  const source = dto as SubscriptionDto & {
    category?: CommonTransactionCategoryDto | null;
    categories?: CommonTransactionCategoryDto[] | null;
  };

  const categories = Array.isArray(source.categories)
    ? source.categories
    : source.category
      ? [source.category]
      : [];

  return normalizeSelectedTransactionCategories(categories);
};

export const toSubscriptionBillingUnit = (
  value: unknown,
): SubscriptionBillingUnit => {
  if (isSubscriptionBillingUnit(value)) {
    return value;
  }

  const legacyCode = toLegacyCode(value);
  if (legacyCode === null) return DEFAULT_SUBSCRIPTION_BILLING_UNIT;

  return (
    LEGACY_SUBSCRIPTION_BILLING_UNIT_BY_CODE[legacyCode] ??
    DEFAULT_SUBSCRIPTION_BILLING_UNIT
  );
};

export const toSubscriptionStatus = (value: unknown): SubscriptionStatus => {
  if (isSubscriptionStatus(value)) {
    return value;
  }

  const legacyCode = toLegacyCode(value);
  if (legacyCode === null) return DEFAULT_SUBSCRIPTION_STATUS;

  return (
    LEGACY_SUBSCRIPTION_STATUS_BY_CODE[legacyCode] ??
    DEFAULT_SUBSCRIPTION_STATUS
  );
};

export const subscriptionDtoToForm = (
  dto: SubscriptionDto,
): SubscriptionFormType => {
  const notificationDaysBefore = parseOptionalFiniteNumber(
    dto.notificationDaysBefore,
  );

  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? "",
    provider: dto.provider,
    account: dto.account ?? null,
    purchaseProvider: dto.purchaseProvider ?? null,
    currency: dto.currency,
    amount: dto.amount ?? 0,
    billingFrequency: dto.billingFrequency ?? 1,
    billingUnit: toSubscriptionBillingUnit(dto.billingUnit),
    status: toSubscriptionStatus(dto.status),
    autoCreateTransaction: !!dto.autoCreateTransaction,
    categories: parseSubscriptionCategories(dto),
    notificationDaysBefore: notificationDaysBefore,
    nextRenewalAt: toDateTimeLocal(dto.nextRenewalAt),
  };
};

export const subscriptionFormToCreateDto = (
  form: SubscriptionFormType,
): AddSubscriptionDto => {
  const notificationDaysBefore = parseOptionalFiniteNumber(
    form.notificationDaysBefore,
  );
  const categories = normalizeSelectedTransactionCategories(form.categories);
  const categoryIds = form.autoCreateTransaction
    ? categories.map((category) => category.id)
    : undefined;

  return {
    name: form.name.trim(),
    description: form.description?.trim() || null,
    providerId: form.provider?.id ?? 0,
    accountId: form.account?.id ?? null,
    purchaseProviderId: form.purchaseProvider?.id ?? null,
    currencyId: form.currency?.id ?? null,
    amount: parseFiniteNumber(form.amount),
    billingFrequency: parseFiniteNumber(form.billingFrequency, 1),
    billingUnit: toSubscriptionBillingUnit(form.billingUnit),
    autoCreateTransaction: !!form.autoCreateTransaction,
    categoryIds,
    notificationDaysBefore,
  };
};

export const subscriptionFormToUpdateDto = (
  form: SubscriptionFormType,
): UpdateSubscriptionDto => {
  const payload = subscriptionFormToCreateDto(form);
  const nextRenewalAt = parseOptionalDateTimeLocal(form.nextRenewalAt);

  return {
    id: form.id,
    ...payload,
    status: toSubscriptionStatus(form.status),
    accountId: form.account?.id ?? 0,
    // Backend: null keeps the current provider, 0 clears it.
    purchaseProviderId: form.purchaseProvider?.id ?? 0,
    nextRenewalAt,
  };
};

const createEmptySubscriptionFormValues = (): Omit<
  SubscriptionFormType,
  "id"
> => {
  return {
    name: "",
    description: "",
    provider: null,
    account: null,
    purchaseProvider: null,
    currency: null,
    amount: 0,
    billingFrequency: 1,
    billingUnit: DEFAULT_SUBSCRIPTION_BILLING_UNIT,
    status: DEFAULT_SUBSCRIPTION_STATUS,
    autoCreateTransaction: false,
    categories: [],
    notificationDaysBefore: null,
  };
};

export const emptyAddSubscriptionForm: Omit<SubscriptionFormType, "id"> =
  createEmptySubscriptionFormValues();

export const emptySubscriptionForm = {
  id: 0,
  ...createEmptySubscriptionFormValues(),
};

export const emptySubscriptionBillingLogForm: SubscriptionBillingLogFormType = {
  subscriptionId: 0,
  amount: "",
  paidAt: nowDateTimeLocal(),
  currency: null,
  note: "",
  autoCreateTransaction: false,
};

export const subscriptionBillingLogFormToDto = (
  form: SubscriptionBillingLogFormType,
): AddSubscriptionBillingLogDto => {
  const amount = parseOptionalFiniteNumber(form.amount);
  const currencyId = form.currency?.id ?? null;
  const note = form.note?.trim() || null;

  return {
    paidAt: form.paidAt,
    autoCreateTransaction: !!form.autoCreateTransaction,
    ...(amount !== null ? { amount } : {}),
    ...(currencyId !== null ? { currencyId } : {}),
    ...(note !== null ? { note } : {}),
  };
};

export const subscriptionBillingLogDtoToForm = (
  dto: SubscriptionBillingLogDto,
): SubscriptionBillingLogFormType => ({
  subscriptionId: 0,
  amount: String(dto.amount ?? ""),
  paidAt: toDateTimeLocal(dto.paidAt),
  currency: dto.currency ?? null,
  note: dto.note ?? "",
  autoCreateTransaction: false,
});

export const subscriptionBillingLogFormToUpdateDto = (
  form: SubscriptionBillingLogFormType,
  dto?: SubscriptionBillingLogDto,
): UpdateSubscriptionBillingLogDto => {
  const amount = parseOptionalFiniteNumber(form.amount);
  const currencyId = form.currency?.id ?? null;

  return {
    id: dto?.id ?? 0,
    subscriptionId: form.subscriptionId,
    paidAt: form.paidAt,
    note: form.note?.trim() ?? "",
    ...(amount !== null ? { amount } : {}),
    ...(currencyId !== null ? { currencyId } : {}),
  };
};

export const formatBillingLogPaidAt = (
  paidAt: string,
  locale: string,
): string => formatDateTime(paidAt, locale);

/** Currency shown next to a billing log amount (name when no symbol). */
export const getBillingLogCurrency = (
  log: Pick<SubscriptionBillingLogDto, "currency">,
): MoneyCurrencyType => ({
  name: log.currency?.name ?? "",
  symbol: log.currency?.symbol ?? log.currency?.name ?? "",
});

/** Plain-text amount for labels, e.g. "1.234,50 €". */
export const getBillingLogAmountLabel = (
  log: Pick<SubscriptionBillingLogDto, "amount" | "currency">,
  locale: string,
): string => {
  const amount = formatAmount(log.amount, locale);
  const { symbol } = getBillingLogCurrency(log);

  return symbol ? `${amount} ${symbol}` : amount;
};

/**
 * A changed renewal date must be in the future: the API bills a due one at
 * once. The loaded date may stay as it is even when it is already past.
 */
export const isValidPickedRenewalDate = (
  value: string | null | undefined,
  loadedValue: string | null | undefined,
  now: Date = new Date(),
): boolean => {
  if (!value || value === (loadedValue ?? "")) return true;

  const picked = new Date(value);
  return !Number.isNaN(picked.getTime()) && picked.getTime() > now.getTime();
};
