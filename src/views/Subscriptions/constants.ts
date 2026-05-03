import type { SubscriptionBillingUnit, SubscriptionStatus } from "lib";

export const DEFAULT_SUBSCRIPTION_BILLING_UNIT: SubscriptionBillingUnit = "MONTH";
export const DEFAULT_SUBSCRIPTION_STATUS: SubscriptionStatus = "ACTIVE";

export const LEGACY_SUBSCRIPTION_BILLING_UNIT_BY_CODE: Record<
  number,
  SubscriptionBillingUnit
> = {
  0: "DAY",
  1: "MONTH",
  2: "YEAR",
};

export const LEGACY_SUBSCRIPTION_STATUS_BY_CODE: Record<
  number,
  SubscriptionStatus
> = {
  0: "ACTIVE",
  1: "PAUSED",
  2: "CANCELED",
};

export const SUBSCRIPTION_STATUS_BADGE_CLASSNAME: Record<
  SubscriptionStatus,
  string
> = {
  ACTIVE: "success",
  PAUSED: "bg-bg-warning text-warning",
  CANCELED: "error",
};
