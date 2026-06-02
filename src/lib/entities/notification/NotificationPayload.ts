export interface SubscriptionRenewalReminderNotificationPayload {
  subscriptionId?: number;
  subscriptionName?: string;
  nextRenewalAt?: string;
  notificationDaysBefore?: number;
  amount?: number;
  userId?: number;
}

export type NotificationPayload =
  | SubscriptionRenewalReminderNotificationPayload
  | Record<string, unknown>;
