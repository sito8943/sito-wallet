import { OfflineBanner as DashboardAppOfflineBanner } from "@sito/dashboard-app";
import { useTranslation } from "react-i18next";

import { useOnlineStatus } from "hooks";

import type { OfflineBannerProps } from "./types";

import "./styles.css";

/**
 * Offline banner wrapper that keeps app-level visibility control
 * while delegating the base UI to @sito/dashboard-app.
 */
export function OfflineBanner({ forceVisible = false }: OfflineBannerProps) {
  const isOnline = useOnlineStatus();
  const { t } = useTranslation();

  if (isOnline && !forceVisible) return null;

  return (
    <DashboardAppOfflineBanner
      isOnline={false}
      className="offline-banner"
      message={t("_accessibility:offline.banner")}
    />
  );
}
