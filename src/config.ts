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
  VITE_SERVER_STATUS_PATH
} = import.meta.env;

const authUserKey = VITE_USER || "user";
const authRememberKey = VITE_REMEMBER || "remember";
const authRefreshTokenKey = VITE_REFRESH_TOKEN_KEY || "refreshToken";
const authAccessTokenExpiresAtKey =
  VITE_ACCESS_TOKEN_EXPIRES_AT_KEY || "accessTokenExpiresAt";

export const config = {
  apiUrl: VITE_API_URL,
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
  auth: {
    user: authUserKey,
    remember: authRememberKey,
    refreshTokenKey: authRefreshTokenKey,
    accessTokenExpiresAtKey: authAccessTokenExpiresAtKey,
    guestMode: VITE_GUEST_MODE,
  },
};
