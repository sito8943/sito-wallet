import { describe, expect, it } from "vitest";

import {
  getNotificationMessage,
  getNotificationTitle,
  type NotificationDto,
} from "lib";

import {
  getUnreadNotificationIds,
  isNotificationUnread,
  toRenderableNotificationError,
} from "./utils";

const notifications: NotificationDto[] = [
  {
    id: 1,
    type: "SUBSCRIPTION_RENEWAL_REMINDER",
    titleKey: "notification.subscriptionRenewalReminder.title",
    messageKey: "notification.subscriptionRenewalReminder.message",
    payload: {
      subscriptionName: "Cloud",
      nextRenewalAt: "2026-06-09T12:00:00",
    },
    createdAt: "2026-06-09T12:00:00",
    readAt: null,
  },
  {
    id: 2,
    type: "SUBSCRIPTION_RENEWAL_REMINDER",
    titleKey: "notification.subscriptionRenewalReminder.title",
    messageKey: "notification.subscriptionRenewalReminder.message",
    payload: {
      subscriptionName: "Mail",
      nextRenewalAt: "2026-06-09T12:30:00",
    },
    createdAt: "2026-06-09T12:00:00",
    readAt: "2026-06-09T12:30:00",
  },
];

const t = ((key: string, values?: Record<string, unknown>) => {
  if (key === "notification.subscriptionRenewalReminder.title") {
    return "Renewal upcoming";
  }

  if (key === "notification.subscriptionRenewalReminder.message") {
    return `${values?.subscriptionName} renews at ${values?.nextRenewalAtFormatted}`;
  }

  return key;
}) as never;

describe("Notifications view utils", () => {
  it("detects unread notifications", () => {
    expect(isNotificationUnread(notifications[0])).toBe(true);
    expect(isNotificationUnread(notifications[1])).toBe(false);
  });

  it("collects unread notification ids", () => {
    expect(getUnreadNotificationIds(notifications)).toEqual([1]);
  });

  it("normalizes unknown errors into renderable errors", () => {
    expect(
      toRenderableNotificationError({ message: "Something failed" }, "Fallback")
        .message,
    ).toBe("Something failed");

    expect(toRenderableNotificationError(null, "Fallback").message).toBe(
      "Fallback",
    );
  });

  it("resolves localized notification title and message", () => {
    expect(
      getNotificationTitle({
        notification: notifications[0],
        t,
        language: "en",
        fallback: "Fallback title",
      }),
    ).toBe("Renewal upcoming");

    expect(
      getNotificationMessage({
        notification: notifications[0],
        t,
        language: "en",
        fallback: "Fallback message",
      }),
    ).toContain("Cloud renews at");
  });
});
