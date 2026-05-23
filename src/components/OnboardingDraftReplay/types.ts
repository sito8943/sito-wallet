import type { OnboardingDraft } from "lib";

export type ReplayAction = "merge" | "discard" | "later";

export interface OnboardingDraftReplayDialogPropsType {
  open: boolean;
  draft: OnboardingDraft;
  isLoading: boolean;
  onMerge: () => void;
  onDiscard: () => void;
  onLater: () => void;
}
