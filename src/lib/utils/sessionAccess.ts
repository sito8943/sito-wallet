import type { WalletSessionAccountDto } from "../types";

const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

export const isAdminSession = (
  account?: WalletSessionAccountDto | null,
): boolean => {
  return isBoolean(account?.admin) && account.admin;
};
