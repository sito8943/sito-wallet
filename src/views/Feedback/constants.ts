import type { FeedbackKind, FeedbackSource } from "lib";

/**
 * React already escapes text: skip i18next HTML escaping so names, emails and
 * dates render as typed (e.g. "11/12/2026").
 */
export const RAW_INTERPOLATION = { escapeValue: false } as const;

/** Translation key of each feedback kind (chip label). */
export const FEEDBACK_KIND_LABEL_KEYS: Record<FeedbackKind, string> = {
  BUG: "_pages:feedback.kinds.bug",
  MISSING: "_pages:feedback.kinds.missing",
  IDEA: "_pages:feedback.kinds.idea",
};

/** Chip modifier class of each feedback kind (semantic status colors). */
export const FEEDBACK_KIND_CLASS_NAMES: Record<FeedbackKind, string> = {
  BUG: "feedback-kind--bug",
  MISSING: "feedback-kind--missing",
  IDEA: "feedback-kind--idea",
};

/** Translation key of each way feedback can be sent. */
export const FEEDBACK_SOURCE_LABEL_KEYS: Record<FeedbackSource, string> = {
  WEB: "_pages:feedback.sources.web",
  KEY: "_pages:feedback.sources.key",
  APP: "_pages:feedback.sources.app",
};
