import { config } from "../../config";

export const getServerStatusUrl = (): string | null => {
  if (!config.apiUrl) return null;
  return `${config.apiUrl.replace(/\/$/, "")}${config.server.statusPath}`;
};

export const getProbeHeaders = (): HeadersInit => {
  if (typeof window === "undefined") return {};

  const token = window.localStorage.getItem(config.auth.user);
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
};
