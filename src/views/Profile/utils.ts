import { isHttpError } from "@sito/dashboard-app";

import type { ProfileLanguage } from "lib";

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const maybeError = error as { message?: string };
    if (typeof maybeError.message === "string") return maybeError.message;
  }

  return fallback;
};

export const toRenderableError = (error: unknown, fallback: string): Error => {
  if (error instanceof Error) return error;
  return new Error(getErrorMessage(error, fallback));
};

export const getChangePasswordErrorMessage = (
  error: unknown,
  t: (key: string) => string,
): string => {
  if (isHttpError(error)) {
    const specificKey = `_accessibility:errors.changePassword.${error.status}`;
    const specificMessage = t(specificKey);
    if (specificMessage !== specificKey) return specificMessage;

    const genericKey = `_accessibility:errors.${error.status}`;
    const genericMessage = t(genericKey);
    if (genericMessage !== genericKey) return genericMessage;
  }

  return getErrorMessage(error, t("_accessibility:errors.500"));
};

export const normalizeProfileLanguage = (
  value?: string | null,
): ProfileLanguage => (value === "en" ? "en" : "es");

export const toDateLabel = (
  value: Date | string | null | undefined,
): string => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

export const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);

  if (!parts.length) return "P";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
};
