import { config } from "../../config";

import { getSnapshot, setServerReachable } from "./store";

let probeInFlight: Promise<boolean> | null = null;

const getServerStatusUrl = () => {
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

export const probeServerReachability = async (): Promise<boolean> => {
  if (!getSnapshot().isBrowserOnline) return false;

  const statusUrl = getServerStatusUrl();
  if (!statusUrl) {
    setServerReachable(true);
    return true;
  }

  if (probeInFlight) return probeInFlight;

  probeInFlight = (async () => {
    try {
      const response = await fetch(statusUrl, {
        method: "GET",
        headers: getProbeHeaders(),
        cache: "no-store",
      });

      const isReachable = response.status < 500;
      setServerReachable(isReachable);
      return isReachable;
    } catch {
      setServerReachable(false);
      return false;
    } finally {
      probeInFlight = null;
    }
  })();

  return probeInFlight;
};
