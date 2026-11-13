import type { FeedbackKind } from "./FeedbackKind";

export interface AddFeedbackDto {
  text: string;
  kind?: FeedbackKind;
  accountId?: number;
}
