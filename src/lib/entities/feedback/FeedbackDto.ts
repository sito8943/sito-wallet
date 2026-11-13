import type { FeedbackKind } from "./FeedbackKind";
import type { FeedbackSource } from "./FeedbackSource";

/** Author of a feedback entry. */
export interface FeedbackUserDto {
  id: number;
  username: string;
  email: string;
}

/** Account a feedback entry is about. */
export interface FeedbackAccountDto {
  id: number;
  name: string;
}

/** Feedback sent by a user (mostly through their AI agent). Admins only. */
export interface FeedbackDto {
  id: number;
  kind: FeedbackKind;
  text: string;
  user: FeedbackUserDto;
  /** Null when the entry is not about a specific account. */
  account: FeedbackAccountDto | null;
  source: FeedbackSource;
  /** ISO local date-time. */
  createdAt: string;
  /** ISO local date-time, null while the entry is open. */
  resolvedAt: string | null;
}
