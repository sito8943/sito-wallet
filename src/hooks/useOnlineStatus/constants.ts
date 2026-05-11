import { config } from "../../config";
import { getProbeHeaders, getServerStatusUrl } from "./utils";

export const onlineStatusOptions = {
  checkIntervalMs: config.server.probeInterval,
  probeUrl: getServerStatusUrl(),
  timeoutMs: 5000,
  probeMethod: "GET" as const,
  probeRequestInit: () => ({
    headers: getProbeHeaders(),
  }),
  resolveIsServerReachable: (response: Response) => response.status < 500,
};
