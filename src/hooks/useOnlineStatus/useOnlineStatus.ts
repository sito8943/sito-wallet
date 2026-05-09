import {
  probeServerReachability as probeServerReachabilityFromLibrary,
  setServerReachable,
  useOnlineStatusSnapshot,
  type OnlineStatusSnapshot,
} from "@sito/dashboard-app";

import { config } from "../../config";

const getServerStatusUrl = (): string | null => {
  if (!config.apiUrl) return null;
  return `${config.apiUrl.replace(/\/$/, "")}${config.server.statusPath}`;
};

const getProbeHeaders = (): HeadersInit => {
  if (typeof window === "undefined") return {};

  const token = window.localStorage.getItem(config.auth.user);
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
};

const onlineStatusOptions = {
  checkIntervalMs: config.server.probeInterval,
  probeUrl: getServerStatusUrl(),
  timeoutMs: 5000,
  probeMethod: "GET" as const,
  probeRequestInit: () => ({
    headers: getProbeHeaders(),
  }),
  resolveIsServerReachable: (response) => response.status < 500,
};

/**
 * Returns true when the browser has network connectivity.
 * Also reflects when the backend is unavailable, even if the browser is online.
 */
export function useOnlineStatus(): boolean {
  return useOnlineStatusSnapshot(onlineStatusOptions).isOnline;
}

export const probeServerReachability = () => {
  return probeServerReachabilityFromLibrary(onlineStatusOptions);
};

export { setServerReachable, useOnlineStatusSnapshot };
export type { OnlineStatusSnapshot };
