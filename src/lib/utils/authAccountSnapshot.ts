import { fromLocal, removeFromLocal, toLocal } from "@sito/dashboard-app";

import { config } from "../../config";
import type { WalletSessionDto } from "../types";

import { isBoolean } from "./guards";

type PublicSessionAccount = Pick<
  WalletSessionDto,
  "id" | "username" | "email"
> & { admin?: boolean };

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

const isPublicSessionAccount = (
  value: unknown,
): value is PublicSessionAccount => {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "number" &&
    isNonEmptyString(candidate.username) &&
    isNonEmptyString(candidate.email) &&
    (candidate.admin === undefined || isBoolean(candidate.admin))
  );
};

export const persistPublicSessionAccount = (
  account: Partial<WalletSessionDto>,
): void => {
  if (!account.id || !account.token) return;
  if (!isNonEmptyString(account.username) || !isNonEmptyString(account.email)) {
    return;
  }

  const snapshot: PublicSessionAccount = {
    id: account.id,
    username: account.username,
    email: account.email,
  };

  if (isBoolean(account.admin)) {
    snapshot.admin = account.admin;
  }

  toLocal(config.auth.accountSnapshotKey, snapshot);
};

export const loadPersistedPublicSessionAccount =
  (): PublicSessionAccount | null => {
    const snapshot = fromLocal(config.auth.accountSnapshotKey, "object");
    return isPublicSessionAccount(snapshot) ? snapshot : null;
  };

export const clearPersistedPublicSessionAccount = (): void => {
  removeFromLocal(config.auth.accountSnapshotKey);
};

export const readStoredRememberMe = (): boolean | undefined => {
  const rememberMe = fromLocal(config.auth.remember, "boolean");
  return typeof rememberMe === "boolean" ? rememberMe : undefined;
};

export const readStoredSessionFromSnapshot = (): WalletSessionDto | null => {
  const snapshot = loadPersistedPublicSessionAccount();
  const token = fromLocal(config.auth.user);

  if (!snapshot || !isNonEmptyString(token)) return null;

  const refreshToken = fromLocal(config.auth.refreshTokenKey);
  const accessTokenExpiresAt = fromLocal(config.auth.accessTokenExpiresAtKey);

  return {
    ...snapshot,
    token,
    refreshToken: isNonEmptyString(refreshToken) ? refreshToken : null,
    accessTokenExpiresAt: isNonEmptyString(accessTokenExpiresAt)
      ? accessTokenExpiresAt
      : null,
  };
};
