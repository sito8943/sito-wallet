import { getSnapshot, setServerReachable } from "./store";
import { getProbeHeaders, getServerStatusUrl } from "./utils";

let probeInFlight: Promise<boolean> | null = null;

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
