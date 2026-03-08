import { config } from "../../config";

import type { OnlineStatusListener } from "./types";
import { probeServerReachability } from "./probe";
import {
  addSnapshotListener,
  hasSnapshotListeners,
  removeSnapshotListener,
  setBrowserOnline,
} from "./store";

let hasWindowListeners = false;
let hasProbeListeners = false;
let probeIntervalId: ReturnType<typeof setInterval> | null = null;

const handleBrowserOnline = () => {
  setBrowserOnline(true);
  void probeServerReachability();
};

const handleBrowserOffline = () => {
  setBrowserOnline(false);
};

const handleVisibilityChange = () => {
  if (typeof document === "undefined" || document.hidden) return;
  void probeServerReachability();
};

const handleWindowFocus = () => {
  void probeServerReachability();
};

const ensureWindowListeners = () => {
  if (typeof window === "undefined" || hasWindowListeners) return;

  window.addEventListener("online", handleBrowserOnline);
  window.addEventListener("offline", handleBrowserOffline);
  hasWindowListeners = true;
};

const cleanupWindowListeners = () => {
  if (typeof window === "undefined" || !hasWindowListeners) return;

  window.removeEventListener("online", handleBrowserOnline);
  window.removeEventListener("offline", handleBrowserOffline);
  hasWindowListeners = false;
};

const ensureProbeListeners = () => {
  if (typeof window === "undefined" || hasProbeListeners) return;

  probeIntervalId = window.setInterval(() => {
    void probeServerReachability();
  }, config.server.probeInterval);

  window.addEventListener("focus", handleWindowFocus);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  hasProbeListeners = true;
  void probeServerReachability();
};

const cleanupProbeListeners = () => {
  if (typeof window === "undefined" || !hasProbeListeners) return;

  if (probeIntervalId) {
    window.clearInterval(probeIntervalId);
    probeIntervalId = null;
  }

  window.removeEventListener("focus", handleWindowFocus);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  hasProbeListeners = false;
};

export const subscribe = (listener: OnlineStatusListener) => {
  ensureWindowListeners();
  ensureProbeListeners();
  addSnapshotListener(listener);

  return () => {
    removeSnapshotListener(listener);

    if (!hasSnapshotListeners()) {
      cleanupWindowListeners();
      cleanupProbeListeners();
    }
  };
};
