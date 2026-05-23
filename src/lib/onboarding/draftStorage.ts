import { compressToUTF16, decompressFromUTF16 } from "lz-string";

import {
  ONBOARDING_DRAFT_STORAGE_KEY,
  ONBOARDING_DRAFT_TTL_MS,
  ONBOARDING_DRAFT_VERSION,
} from "./constants";
import type { OnboardingDraft } from "./types";

const isBrowser = (): boolean =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const isValidDraft = (value: unknown): value is OnboardingDraft => {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.version === "number" &&
    typeof v.createdAt === "number" &&
    typeof v.updatedAt === "number" &&
    typeof v.nextLocalId === "number" &&
    Array.isArray(v.currencies) &&
    Array.isArray(v.accounts) &&
    Array.isArray(v.transactionCategories) &&
    Array.isArray(v.subscriptionProviders) &&
    Array.isArray(v.selectedEntityKeys)
  );
};

export const readDraft = (): OnboardingDraft | null => {
  if (!isBrowser()) return null;

  const raw = window.localStorage.getItem(ONBOARDING_DRAFT_STORAGE_KEY);
  if (!raw) return null;

  let parsed: unknown;
  try {
    const decompressed = decompressFromUTF16(raw);
    if (!decompressed) return null;
    parsed = JSON.parse(decompressed);
  } catch {
    return null;
  }

  if (!isValidDraft(parsed)) {
    clearDraft();
    return null;
  }

  if (parsed.version !== ONBOARDING_DRAFT_VERSION) {
    clearDraft();
    return null;
  }

  if (Date.now() - parsed.createdAt > ONBOARDING_DRAFT_TTL_MS) {
    clearDraft();
    return null;
  }

  return parsed;
};

export const writeDraft = (draft: OnboardingDraft): void => {
  if (!isBrowser()) return;

  const payload: OnboardingDraft = { ...draft, updatedAt: Date.now() };

  try {
    const compressed = compressToUTF16(JSON.stringify(payload));
    window.localStorage.setItem(ONBOARDING_DRAFT_STORAGE_KEY, compressed);
  } catch {
    // ignore storage failures (quota exceeded, private mode, etc.)
  }
};

export const clearDraft = (): void => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ONBOARDING_DRAFT_STORAGE_KEY);
};
