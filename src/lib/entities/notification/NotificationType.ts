export const NotificationType = {
  SubscriptionRenewalReminder: "SUBSCRIPTION_RENEWAL_REMINDER",
  GoalDeadlineReminder: "GOAL_DEADLINE_REMINDER",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType] | (string & {});
