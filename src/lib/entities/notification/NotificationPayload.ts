export interface SubscriptionRenewalReminderNotificationPayload {
  subscriptionId?: number;
  subscriptionName?: string;
  nextRenewalAt?: string;
  notificationDaysBefore?: number;
  amount?: number;
  userId?: number;
}

export interface GoalDeadlineReminderNotificationPayload {
  goalId?: number;
  goalName?: string;
  /** "YYYY-MM-DD". */
  deadline?: string;
  /** 7 or 0 (the deadline day). */
  daysLeft?: number;
  remaining?: number;
  currencySymbol?: string;
}

export type NotificationPayload =
  | SubscriptionRenewalReminderNotificationPayload
  | GoalDeadlineReminderNotificationPayload
  | Record<string, unknown>;
