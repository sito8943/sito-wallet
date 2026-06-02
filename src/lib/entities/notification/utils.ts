import type { TFunction } from "i18next";

import type { NotificationDto } from "./NotificationDto";
import type { NotificationPayload } from "./NotificationPayload";

const toRecord = (
  payload?: NotificationPayload | null,
): Record<string, unknown> => {
  if (typeof payload !== "object" || payload === null) return {};
  return payload as Record<string, unknown>;
};

const formatNotificationDate = (
  value: unknown,
  language: string,
): string | undefined => {
  if (typeof value !== "string" || !value.trim().length) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  return new Intl.DateTimeFormat(language, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatNotificationAmount = (
  value: unknown,
  language: string,
): string | undefined => {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;

  return new Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const getNotificationTranslationValues = (
  payload: NotificationPayload | null | undefined,
  language: string,
): Record<string, unknown> => {
  const values = toRecord(payload);

  return {
    ...values,
    nextRenewalAtFormatted: formatNotificationDate(
      values.nextRenewalAt,
      language,
    ),
    amountFormatted: formatNotificationAmount(values.amount, language),
  };
};

export const translateNotificationText = ({
  t,
  key,
  payload,
  language,
  fallback,
}: {
  t: TFunction;
  key?: string | null;
  payload?: NotificationPayload | null;
  language: string;
  fallback: string;
}): string => {
  if (!key || !key.trim().length) return fallback;

  const translated = t(key, getNotificationTranslationValues(payload, language));
  return translated === key ? fallback : translated;
};

export const getNotificationTitle = ({
  notification,
  t,
  language,
  fallback,
}: {
  notification: NotificationDto;
  t: TFunction;
  language: string;
  fallback: string;
}): string => {
  return translateNotificationText({
    t,
    key: notification.titleKey,
    payload: notification.payload,
    language,
    fallback,
  });
};

export const getNotificationMessage = ({
  notification,
  t,
  language,
  fallback,
}: {
  notification: NotificationDto;
  t: TFunction;
  language: string;
  fallback: string;
}): string => {
  return translateNotificationText({
    t,
    key: notification.messageKey,
    payload: notification.payload,
    language,
    fallback,
  });
};
