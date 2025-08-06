export enum NotificationEnumType {
  success,
  error,
  warning,
  info = 3,
}

export type NotificationType = {
  message?: string;
  type?: NotificationEnumType;
  id?: number;
};
