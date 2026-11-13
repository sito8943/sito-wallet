import type { FeedbackDto, FeedbackKind, FeedbackSource } from "lib";

import {
  FEEDBACK_KIND_CLASS_NAMES,
  FEEDBACK_KIND_LABEL_KEYS,
  FEEDBACK_SOURCE_LABEL_KEYS,
} from "./constants";
import type { SplitFeedbackType } from "./types";

/** True when an admin marked the entry as resolved. */
export const isFeedbackResolved = (entry: FeedbackDto): boolean =>
  entry.resolvedAt !== null;

/** Newest first; entries with an unparsable date keep their order. */
const byNewestFirst = (a: FeedbackDto, b: FeedbackDto): number => {
  const diff = Date.parse(b.createdAt) - Date.parse(a.createdAt);
  return Number.isNaN(diff) ? 0 : diff;
};

/** Splits the inbox into open and resolved entries, both newest first. */
export const splitFeedbackByStatus = (
  entries: FeedbackDto[],
): SplitFeedbackType => {
  const sorted = [...entries].sort(byNewestFirst);
  return {
    open: sorted.filter((entry) => !isFeedbackResolved(entry)),
    resolved: sorted.filter(isFeedbackResolved),
  };
};

export const getFeedbackKindLabelKey = (kind: FeedbackKind): string =>
  FEEDBACK_KIND_LABEL_KEYS[kind];

export const getFeedbackKindClassName = (kind: FeedbackKind): string =>
  FEEDBACK_KIND_CLASS_NAMES[kind];

export const getFeedbackSourceLabelKey = (source: FeedbackSource): string =>
  FEEDBACK_SOURCE_LABEL_KEYS[source];
