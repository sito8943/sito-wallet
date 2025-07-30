import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function useTimeAge() {
  const { t, i18n } = useTranslation();

  const timeAge = useCallback(
    (date: Date) => {
      const now = new Date();

      const diffInMilliseconds = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);

      const isSpanish = i18n.language === "es";
      const ago = t("_accessibility:labels.ago");
      const minute = t("_accessibility:labels.minute");
      const minutes = t("_accessibility:labels.minutes");
      const hour = t("_accessibility:labels.hour");
      const hours = t("_accessibility:labels.hours");
      const yesterday = t("_accessibility:labels.yesterday");
      const justNow = t("_accessibility:labels.justNow");

      if (diffInMilliseconds < 1000 * 60) {
        return justNow;
      }
      if (diffInMinutes < 60) {
        return `${isSpanish ? ago : ""} ${diffInMinutes} ${
          diffInMinutes === 1 ? minute : minutes
        } ${isSpanish ? "" : ago}`;
      }
      if (diffInHours < 24) {
        return `${isSpanish ? ago : ""} ${diffInHours} ${
          diffInHours === 1 ? hour : hours
        } ${isSpanish ? "" : ago}`;
      }
      if (diffInHours < 48) {
        return yesterday;
      }

      return date.toLocaleDateString(navigator.language || "es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    [t, i18n.language]
  );

  return { timeAge };
}
