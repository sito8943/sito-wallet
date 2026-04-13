import {
  AddSubscriptionBillingLogDto,
  AddSubscriptionDto,
  SubscriptionBillingUnit,
  SubscriptionDto,
  SubscriptionStatus,
  UpdateSubscriptionDto,
} from "lib";

import {
  SUBSCRIPTION_BILLING_UNIT_BY_CODE,
  SUBSCRIPTION_STATUS_BY_CODE,
} from "./constants";
import { SubscriptionBillingLogFormType, SubscriptionFormType } from "./types";

const parseFiniteNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
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

const toOptionalDateTime = (value?: string | null): string | null | undefined => {
  if (!value) return undefined;

  const parsed = value.trim();
  return parsed.length ? parsed : undefined;
};

export const toSubscriptionBillingUnit = (
  value: number | string | null | undefined,
): SubscriptionBillingUnit => {
  if (
    value === "DAY" ||
    value === "MONTH" ||
    value === "YEAR"
  ) {
    return value;
  }

  return SUBSCRIPTION_BILLING_UNIT_BY_CODE[Number(value)] ?? "MONTH";
};

export const toSubscriptionStatus = (
  value: number | string | null | undefined,
): SubscriptionStatus => {
  if (value === "ACTIVE" || value === "PAUSED" || value === "CANCELED") {
    return value;
  }

  return SUBSCRIPTION_STATUS_BY_CODE[Number(value)] ?? "ACTIVE";
};

export const subscriptionDtoToForm = (
  dto: SubscriptionDto,
): SubscriptionFormType => ({
  id: dto.id,
  name: dto.name,
  description: dto.description ?? "",
  provider: dto.provider,
  currency: dto.currency,
  amount: String(dto.amount ?? ""),
  billingFrequency: String(dto.billingFrequency ?? ""),
  billingUnit: toSubscriptionBillingUnit(dto.billingUnit),
  startsAt: toDateTimeLocal(dto.startsAt),
  lastPaidAt: toDateTimeLocal(dto.lastPaidAt),
  status: toSubscriptionStatus(dto.status),
  notificationEnabled: !!dto.notificationEnabled,
  notificationDaysBefore:
    dto.notificationDaysBefore === null || dto.notificationDaysBefore === undefined
      ? ""
      : String(dto.notificationDaysBefore),
});

export const subscriptionFormToCreateDto = (
  form: SubscriptionFormType,
): AddSubscriptionDto => {
  const notificationEnabled = !!form.notificationEnabled;
  const notificationDaysBefore = notificationEnabled
    ? parseFiniteNumber(form.notificationDaysBefore)
    : null;

  return {
    name: form.name.trim(),
    description: form.description?.trim() || null,
    providerId: form.provider?.id ?? 0,
    currencyId: form.currency?.id ?? null,
    amount: parseFiniteNumber(form.amount),
    billingFrequency: parseFiniteNumber(form.billingFrequency, 1),
    billingUnit: toSubscriptionBillingUnit(form.billingUnit),
    startsAt: form.startsAt,
    lastPaidAt: toOptionalDateTime(form.lastPaidAt) ?? null,
    status: toSubscriptionStatus(form.status),
    notificationEnabled,
    notificationDaysBefore,
  };
};

export const subscriptionFormToUpdateDto = (
  form: SubscriptionFormType,
): UpdateSubscriptionDto => ({
  id: form.id,
  ...subscriptionFormToCreateDto(form),
});

export const emptyAddSubscriptionForm: Omit<SubscriptionFormType, "id"> = {
  name: "",
  description: "",
  provider: null,
  currency: null,
  amount: "",
  billingFrequency: "1",
  billingUnit: "MONTH",
  startsAt: nowDateTimeLocal(),
  lastPaidAt: "",
  status: "ACTIVE",
  notificationEnabled: false,
  notificationDaysBefore: "",
};

export const emptySubscriptionForm: SubscriptionFormType = {
  id: 0,
  name: "",
  description: "",
  provider: null,
  currency: null,
  amount: "",
  billingFrequency: "1",
  billingUnit: "MONTH",
  startsAt: nowDateTimeLocal(),
  lastPaidAt: "",
  status: "ACTIVE",
  notificationEnabled: false,
  notificationDaysBefore: "",
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
