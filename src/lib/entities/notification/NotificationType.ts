export const NotificationType = {
  SubscriptionRenewalReminder: "SUBSCRIPTION_RENEWAL_REMINDER",
} as const;

export type NotificationType =
  | (typeof NotificationType)[keyof typeof NotificationType]
  | string;
