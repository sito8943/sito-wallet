import type { SessionAccountDto } from "@sito/dashboard-app";

const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

export const isAdminSession = (
  account?: SessionAccountDto | null,
): boolean => {
  return isBoolean(account?.admin) && account.admin;
};
