import {
  AddSubscriptionBillingLogDto,
  AddSubscriptionDto,
  SUBSCRIPTION_BILLING_UNITS,
  SUBSCRIPTION_STATUSES,
  SubscriptionBillingUnit,
  SubscriptionDto,
  SubscriptionStatus,
  UpdateSubscriptionDto,
} from "lib";

import {
  DEFAULT_SUBSCRIPTION_BILLING_UNIT,
  DEFAULT_SUBSCRIPTION_STATUS,
  LEGACY_SUBSCRIPTION_BILLING_UNIT_BY_CODE,
  LEGACY_SUBSCRIPTION_STATUS_BY_CODE,
} from "./constants";
import { SubscriptionBillingLogFormType, SubscriptionFormType } from "./types";

const parseFiniteNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "string" && value.trim().length === 0) return fallback;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

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

const toDateTimeLocal = (value?: string | null): string => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value.slice(0, 16) : "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const nowDateTimeLocal = (): string => {
  return toDateTimeLocal(new Date().toISOString());
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
    currency: dto.currency,
    amount: dto.amount ?? 0,
    billingFrequency: dto.billingFrequency ?? 1,
    billingUnit: toSubscriptionBillingUnit(dto.billingUnit),
    status: toSubscriptionStatus(dto.status),
    autoCreateTransaction: !!dto.autoCreateTransaction,
    notificationDaysBefore: notificationDaysBefore,
  };
};

export const subscriptionFormToCreateDto = (
  form: SubscriptionFormType,
): AddSubscriptionDto => {
  const notificationDaysBefore = parseOptionalFiniteNumber(
    form.notificationDaysBefore,
  );

  return {
    name: form.name.trim(),
    description: form.description?.trim() || null,
    providerId: form.provider?.id ?? 0,
    accountId: form.account?.id ?? null,
    currencyId: form.currency?.id ?? null,
    amount: parseFiniteNumber(form.amount),
    billingFrequency: parseFiniteNumber(form.billingFrequency, 1),
    billingUnit: toSubscriptionBillingUnit(form.billingUnit),
    autoCreateTransaction: !!form.autoCreateTransaction,
    notificationDaysBefore,
  };
};

export const subscriptionFormToUpdateDto = (
  form: SubscriptionFormType,
): UpdateSubscriptionDto => {
  const payload = subscriptionFormToCreateDto(form);
  return {
    id: form.id,
    ...payload,
    status: toSubscriptionStatus(form.status),
    accountId: form.account?.id ?? 0,
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
    currency: null,
    amount: 0,
    billingFrequency: 1,
    billingUnit: DEFAULT_SUBSCRIPTION_BILLING_UNIT,
    status: DEFAULT_SUBSCRIPTION_STATUS,
    autoCreateTransaction: false,
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
};

export const subscriptionBillingLogFormToDto = (
  form: SubscriptionBillingLogFormType,
): AddSubscriptionBillingLogDto => ({
  amount: parseFiniteNumber(form.amount),
  paidAt: form.paidAt,
  currencyId: form.currency?.id ?? null,
  note: form.note?.trim() || null,
});
