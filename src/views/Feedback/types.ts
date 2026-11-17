// lib
import type { FeedbackDto, SetFeedbackResolvedDto } from "lib";

/** Feedback split by status, both newest first. */
export interface SplitFeedbackType {
  open: FeedbackDto[];
  resolved: FeedbackDto[];
}

export interface FeedbackSectionPropsType {
  entries: FeedbackDto[];
  isLoading: boolean;
  hasError: boolean;
  /** The query's error, so a dropped connection reads as one. */
  error?: unknown;
  onRetry: () => void;
  onToggleResolved: (entry: FeedbackDto) => void;
  /** Id of the entry being updated, null when none. */
  pendingId: number | null;
}

export interface FeedbackListItemPropsType {
  entry: FeedbackDto;
  onToggleResolved: (entry: FeedbackDto) => void;
  disabled?: boolean;
}

export interface UseSetFeedbackResolvedReturnType {
  /** Resolves an open entry or reopens a resolved one. */
  toggleResolved: (entry: FeedbackDto) => void;
  /** Id of the entry being updated, null when none. */
  pendingId: number | null;
}

/** Variables of the resolve/reopen mutation. */
export interface SetFeedbackResolvedVariablesType extends SetFeedbackResolvedDto {
  id: number;
}
