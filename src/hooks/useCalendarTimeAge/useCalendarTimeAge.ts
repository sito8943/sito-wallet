import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { formatCalendarTimeAge } from "./utils";

export function useCalendarTimeAge() {
  const translation = useTranslation();
  const { t } = translation;

  return {
    timeAge: useCallback(
      (date: Date) =>
        formatCalendarTimeAge(date, {
          language: translation.i18n?.language ?? navigator.language ?? "es-ES",
          labels: {
            ago: t("_accessibility:labels.ago"),
            minute: t("_accessibility:labels.minute"),
            minutes: t("_accessibility:labels.minutes"),
            hour: t("_accessibility:labels.hour"),
            hours: t("_accessibility:labels.hours"),
            yesterday: t("_accessibility:labels.yesterday"),
            justNow: t("_accessibility:labels.justNow"),
          },
        }),
      [t, translation.i18n?.language],
    ),
  };
}
