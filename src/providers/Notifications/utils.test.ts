import { describe, expect, it, vi } from "vitest";

vi.mock("../../config", () => ({
  config: {
    serverUrl: "https://api.example.com",
  },
}));

import {
  getSocketNotificationMessage,
  handleNotificationSocketMessage,
} from "./utils";

describe("Notifications provider utils", () => {
  const t = ((key: string, values?: Record<string, unknown>) => {
    if (key === "notification.subscriptionRenewalReminder.title") {
      return "Renewal upcoming";
    }

    if (key === "notification.subscriptionRenewalReminder.message") {
      return `${values?.subscriptionName} renews at ${values?.nextRenewalAtFormatted}`;
    }

    return key;
  }) as never;

  it("builds a readable socket message from titleKey and messageKey", () => {
    expect(
      getSocketNotificationMessage(
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
        },
        t,
        "en",
        "Fallback",
      ),
    ).toContain("Renewal upcoming: Cloud renews at");
  });

  it("falls back when the socket payload is invalid", async () => {
    const showNotification = vi.fn();
    const invalidateNotifications = vi.fn().mockResolvedValue(undefined);

    await handleNotificationSocketMessage({
      frame: {
        body: "{invalid-json",
      } as never,
      runtime: {
        showNotification,
        invalidateNotifications,
      },
      fallbackMessage: "Fallback message",
      t,
      language: "en",
    });

    expect(showNotification).toHaveBeenCalledWith({
      message: "Fallback message",
    });
    expect(invalidateNotifications).toHaveBeenCalledTimes(1);
  });
});
