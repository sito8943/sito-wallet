import { NETWORK_ERROR_FRAGMENTS } from "./constants";

export const isNetworkError = (error?: Error | null): boolean => {
  if (!error) return false;

  const message = error.message?.toLowerCase() ?? "";

  return NETWORK_ERROR_FRAGMENTS.some((fragment) => message.includes(fragment));
};
