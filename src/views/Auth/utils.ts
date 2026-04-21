// config
import { config } from "../../config";

export const buildAuthRedirectUrl = (path: string): string => {
  const base = config.thisUrl || window.location.origin;
  return new URL(path, base).toString();
};

export const extractRecoveryAccessTokenFromLocation = (
  hash: string,
  search: string,
): string | null => {
  const searchParams = new URLSearchParams(search);

  const rawHash = hash.startsWith("#") ? hash.slice(1) : hash;
  const hashQuery = rawHash.includes("?")
    ? rawHash.slice(rawHash.indexOf("?") + 1)
    : rawHash;
  const hashParams = new URLSearchParams(hashQuery);

  const keys = ["access_token", "accessToken", "token"];
  for (const key of keys) {
    const fromSearch = searchParams.get(key);
    if (fromSearch && fromSearch.length > 0) return fromSearch;

    const fromHash = hashParams.get(key);
    if (fromHash && fromHash.length > 0) return fromHash;
  }

  return null;
};

export const getTranslatedStatusMessage = (
  t: (key: string) => string,
  keyPrefix: string,
  status: number,
): string | null => {
  const key = `${keyPrefix}.${status}`;
  const translated = t(key);
  return translated === key ? null : translated;
};
