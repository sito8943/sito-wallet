import { useSyncExternalStore } from "react";

import { probeServerReachability } from "./probe";
import { getServerSnapshot, getSnapshot, setServerReachable } from "./store";
import { subscribe } from "./subscribe";
import type { OnlineStatusSnapshot } from "./types";

export function useOnlineStatusSnapshot(): OnlineStatusSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Returns true when the browser has network connectivity.
 * Also reflects when the backend is unavailable, even if the browser is online.
 */
export function useOnlineStatus(): boolean {
  return useOnlineStatusSnapshot().isOnline;
}

export { probeServerReachability, setServerReachable };
export type { OnlineStatusSnapshot };
