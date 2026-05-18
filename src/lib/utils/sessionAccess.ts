import type { WalletSessionAccountDto } from "../types";

const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

export const hasAuthenticatedSession = (
  account?: WalletSessionAccountDto | null,
): boolean => {
  return Boolean(account?.id || account?.email);
};

export const isAnonymousVisitorSession = (
  account?: WalletSessionAccountDto | null,
  isGuestMode = false,
): boolean => {
  return !hasAuthenticatedSession(account) && !isGuestMode;
};

export const isAdminSession = (
  account?: WalletSessionAccountDto | null,
): boolean => {
  return isBoolean(account?.admin) && account.admin;
};
