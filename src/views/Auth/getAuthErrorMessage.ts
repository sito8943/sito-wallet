import type { AuthErrorViewType } from "./types";

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
