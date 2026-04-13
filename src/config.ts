import type { AppFeatures } from "./lib/api/featureFlags/types";

const {
  VITE_API_URL,
  VITE_THIS_URL,
  VITE_LANGUAGE,
  VITE_BASIC_KEY,
  VITE_ACCEPT_COOKIE,
  VITE_DECLINE_COOKIE,
  VITE_REMEMBER,
  VITE_USER,
  VITE_VALIDATION_COOKIE,
  VITE_RECOVERING_COOKIE,
  VITE_CRYPTO,
  VITE_SUPABASE_CO,
  VITE_SUPABASE_ANON,
  VITE_ONBOARDING,
  VITE_GUEST_MODE,
  VITE_RECENT_SEARCHES,
  VITE_INDEXED_DB_NAME,
  VITE_APP_VERSION,
  VITE_REFRESH_TOKEN_KEY,
  VITE_ACCESS_TOKEN_EXPIRES_AT_KEY,
  VITE_SERVER_PROBE_INTERVAL,
  VITE_SERVER_STATUS_PATH,
  VITE_FEATURE_FLAGS_STORAGE_KEY,
  VITE_FEATURE_BALANCE_GREATER_THAN_ZERO_DEFAULT,
  VITE_FEATURE_CURRENCIES_ENABLED_DEFAULT,
  VITE_FEATURE_ACCOUNTS_ENABLED_DEFAULT,
  VITE_FEATURE_TRANSACTIONS_ENABLED_DEFAULT,
  VITE_FEATURE_SUBSCRIPTIONS_ENABLED_DEFAULT,
} = import.meta.env;

const parseStrictBoolean = (
  value: string | undefined,
  key: string,
): boolean => {
  if (value === "true") return true;
  if (value === "false") return false;

  throw new Error(
    `[config] ${key} must be explicitly set to "true" or "false". Received "${String(
      value,
    )}"`,
  );
};

const requireEnvString = (value: string | undefined, key: string): string => {
  if (value && value.length > 0) return value;

  throw new Error(`[config] ${key} is required.`);
};

const authUserKey = VITE_USER || "user";
const authRememberKey = VITE_REMEMBER || "remember";
const authRefreshTokenKey = VITE_REFRESH_TOKEN_KEY || "refreshToken";
const authAccessTokenExpiresAtKey =
  VITE_ACCESS_TOKEN_EXPIRES_AT_KEY || "accessTokenExpiresAt";
const authAccountSnapshotKey = `${authUserKey}:account`;
const featureFlagsDefaults: AppFeatures = {
  balanceGreaterThanZero: parseStrictBoolean(
    VITE_FEATURE_BALANCE_GREATER_THAN_ZERO_DEFAULT,
    "VITE_FEATURE_BALANCE_GREATER_THAN_ZERO_DEFAULT",
  ),
  currenciesEnabled: parseStrictBoolean(
    VITE_FEATURE_CURRENCIES_ENABLED_DEFAULT,
    "VITE_FEATURE_CURRENCIES_ENABLED_DEFAULT",
  ),
  accountsEnabled: parseStrictBoolean(
    VITE_FEATURE_ACCOUNTS_ENABLED_DEFAULT,
    "VITE_FEATURE_ACCOUNTS_ENABLED_DEFAULT",
  ),
  transactionsEnabled: parseStrictBoolean(
    VITE_FEATURE_TRANSACTIONS_ENABLED_DEFAULT,
    "VITE_FEATURE_TRANSACTIONS_ENABLED_DEFAULT",
  ),
  subscriptionsEnabled: parseStrictBoolean(
    VITE_FEATURE_SUBSCRIPTIONS_ENABLED_DEFAULT,
    "VITE_FEATURE_SUBSCRIPTIONS_ENABLED_DEFAULT",
  ),
};

const serverUrl = new URL(VITE_API_URL).origin;

export const config = {
  apiUrl: VITE_API_URL,
  serverUrl,
  thisUrl: VITE_THIS_URL,
  language: VITE_LANGUAGE,
  basicKey: VITE_BASIC_KEY,
  acceptCookie: VITE_ACCEPT_COOKIE,
  declineCookie: VITE_DECLINE_COOKIE,
  remember: authRememberKey,
  user: authUserKey,
  recentSearches: VITE_RECENT_SEARCHES,
  appVersion: VITE_APP_VERSION,
  validationCookie: VITE_VALIDATION_COOKIE,
  recoveringCookie: VITE_RECOVERING_COOKIE,
  crypto: VITE_CRYPTO,
  supabaseCo: VITE_SUPABASE_CO,
  supabaseAnon: VITE_SUPABASE_ANON,
  onboarding: VITE_ONBOARDING,
  guestMode: VITE_GUEST_MODE,
  indexedDBName: VITE_INDEXED_DB_NAME,
  server: {
    probeInterval: Number(VITE_SERVER_PROBE_INTERVAL) || 15000,
    statusPath: VITE_SERVER_STATUS_PATH || "/sync/status",
  },
  featureFlags: {
    storageKey: requireEnvString(
      VITE_FEATURE_FLAGS_STORAGE_KEY,
      "VITE_FEATURE_FLAGS_STORAGE_KEY",
    ),
    defaults: featureFlagsDefaults,
  },
  tableOptions: "sito-wallet:table-options",
  auth: {
    user: authUserKey,
    remember: authRememberKey,
    refreshTokenKey: authRefreshTokenKey,
    accessTokenExpiresAtKey: authAccessTokenExpiresAtKey,
    accountSnapshotKey: authAccountSnapshotKey,
    guestMode: VITE_GUEST_MODE,
  },
};
