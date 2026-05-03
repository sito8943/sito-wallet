// config
import { config } from "../../config";
import { AuthRouteQueryParam } from "lib";
import type { AuthErrorViewType } from "./types";

const recoveryAccessTokenParams = [
  AuthRouteQueryParam.accessToken,
  AuthRouteQueryParam.accessTokenLegacy,
  AuthRouteQueryParam.token,
] as const;

const getHashParams = (hash: string): URLSearchParams => {
  const rawHash = hash.startsWith("#") ? hash.slice(1) : hash;
  const hashQuery = rawHash.includes("?")
    ? rawHash.slice(rawHash.indexOf("?") + 1)
    : rawHash;
  return new URLSearchParams(hashQuery);
};

export const buildAuthRedirectUrl = (path: string): string => {
  const base = config.thisUrl || window.location.origin;
  return new URL(path, base).toString();
};

export const extractRecoveryAccessTokenFromLocation = (
  hash: string,
  search: string,
): string | null => {
  const searchParams = new URLSearchParams(search);
  const hashParams = getHashParams(hash);

  for (const key of recoveryAccessTokenParams) {
    const fromSearch = searchParams.get(key);
    if (fromSearch && fromSearch.length > 0) return fromSearch;

    const fromHash = hashParams.get(key);
    if (fromHash && fromHash.length > 0) return fromHash;
  }

  return null;
};

export const extractAuthQueryParamFromLocation = (
  hash: string,
  search: string,
  key: string,
): string | null => {
  const searchParams = new URLSearchParams(search);
  const hashParams = getHashParams(hash);

  const fromSearch = searchParams.get(key);
  if (fromSearch && fromSearch.length > 0) return fromSearch;

  const fromHash = hashParams.get(key);
  if (fromHash && fromHash.length > 0) return fromHash;

  return null;
};

export const hasAuthErrorParamsInLocation = (
  hash: string,
  search: string,
): boolean => {
  const searchParams = new URLSearchParams(search);
  const hashParams = getHashParams(hash);

  return (
    searchParams.has(AuthRouteQueryParam.error) ||
    searchParams.has(AuthRouteQueryParam.errorDescription) ||
    hashParams.has(AuthRouteQueryParam.error) ||
    hashParams.has(AuthRouteQueryParam.errorDescription)
  );
};

const getTranslatedMessageByKey = (
  t: (key: string) => string,
  key: string,
): string | null => {
  const translated = t(key);
  return translated === key ? null : translated;
};

const pushErrorKey = (keys: string[], key: string) => {
  if (!keys.includes(key)) keys.push(key);
};

export const getAuthErrorMessage = (
  t: (key: string) => string,
  status?: number,
  view?: AuthErrorViewType,
): string => {
  const keys: string[] = [];

  if (typeof status === "number" && view) {
    pushErrorKey(keys, `_accessibility:errors.${view}.${status}`);
  }
  if (typeof status === "number") {
    pushErrorKey(keys, `_accessibility:errors.${status}`);
  }

  pushErrorKey(keys, "_accessibility:errors.500");
  pushErrorKey(keys, "_accessibility:errors.unknownError");

  for (const key of keys) {
    const translated = getTranslatedMessageByKey(t, key);
    if (translated) return translated;
  }

  const fallback = t("_accessibility:errors.unknownError");
  return fallback === "_accessibility:errors.unknownError"
    ? "An error has occurred"
    : fallback;
};
