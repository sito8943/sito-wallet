import type { NotificationDto } from "lib";

export const isNotificationUnread = (notification: NotificationDto): boolean =>
  !notification.readAt;

export const getUnreadNotificationIds = (
  notifications: NotificationDto[],
): number[] => {
  return notifications
    .filter((notification) => isNotificationUnread(notification))
    .map((notification) => notification.id);
};

export const toRenderableNotificationError = (
  error: unknown,
  fallbackMessage: string,
): Error => {
  if (error instanceof Error) return error;

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = error.message;
    if (typeof message === "string" && message.trim().length > 0) {
      return new Error(message);
    }
  }

  return new Error(fallbackMessage);
};
