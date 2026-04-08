import { probeServerReachability } from "./probe";
import { setServerReachable } from "./store";
import type { OnlineStatusSnapshot } from "./types";
import { useOnlineStatusSnapshot } from "./useOnlineStatusSnapshot";

/**
 * Returns true when the browser has network connectivity.
 * Also reflects when the backend is unavailable, even if the browser is online.
 */
export function useOnlineStatus(): boolean {
  return useOnlineStatusSnapshot().isOnline;
}

export { useOnlineStatusSnapshot };
export { probeServerReachability, setServerReachable };
export type { OnlineStatusSnapshot };
