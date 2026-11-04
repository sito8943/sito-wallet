import { fromLocal, removeFromLocal, toLocal } from "@sito/dashboard-app";

import { isBoolean, isObject } from "../utils/guards";
import { CONSENT_VERSION } from "./constants";
import type { StoredConsent } from "./types";

/** The stored choice, or null when there is none (or it is from an older version). */
export const readStoredConsent = (storageKey: string): StoredConsent | null => {
  const stored: unknown = fromLocal(storageKey, "object");
  if (!isObject(stored)) return null;
  const { analytics, version, decidedAt } = stored;
  if (
    !isBoolean(analytics) ||
    version !== CONSENT_VERSION ||
    typeof decidedAt !== "string"
  )
    return null;
  return { analytics, version, decidedAt };
};

export const persistConsent = (
  storageKey: string,
  analytics: boolean,
  now: Date = new Date(),
): StoredConsent => {
  const consent: StoredConsent = {
    analytics,
    version: CONSENT_VERSION,
    decidedAt: now.toISOString(),
  };
  toLocal(storageKey, consent);
  return consent;
};

export const clearStoredConsent = (storageKey: string) =>
  removeFromLocal(storageKey);
