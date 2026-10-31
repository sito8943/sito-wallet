import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Loading, classNames } from "@sito/dashboard-app";

// constants
import { SPLASH_EXIT_MS } from "./constants";

// types
import type { SplashScreenPropsType } from "./types";

// utils
import { getRemainingVisibleMs } from "./utils";

import "./styles.css";

/**
 * Full-screen app splash: app name + spinner. Stays up for a minimum time,
 * then fades out over the already-rendered app and unmounts.
 */
export function SplashScreen(props: SplashScreenPropsType) {
  const { visible = true } = props;
  const { t } = useTranslation();

  // Mounted hidden (e.g. the wait was already over) means never shown.
  const [shownAt, setShownAt] = useState(() => (visible ? Date.now() : null));
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (visible) {
      setShownAt((current) => current ?? Date.now());
      setExiting(false);
      return undefined;
    }
    if (shownAt === null) return undefined;

    const exitTimeout = window.setTimeout(
      () => setExiting(true),
      getRemainingVisibleMs(shownAt),
    );
    return () => window.clearTimeout(exitTimeout);
  }, [visible, shownAt]);

  useEffect(() => {
    if (!exiting) return undefined;
    const unmountTimeout = window.setTimeout(() => {
      setShownAt(null);
      setExiting(false);
    }, SPLASH_EXIT_MS);
    return () => window.clearTimeout(unmountTimeout);
  }, [exiting]);

  if (shownAt === null) return null;

  const appName = t("_pages:home.appName");

  return (
    <div
      aria-hidden={exiting}
      className={classNames("splash-screen", exiting ? "exiting" : "")}
    >
      <h1 className="splash-screen-title appear">{appName}</h1>
      <Loading
        aria-label={appName}
        color="stroke-text-primary"
        className="splash-screen-loading"
      />
    </div>
  );
}
