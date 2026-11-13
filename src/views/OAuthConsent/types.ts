import type { ReactNode } from "react";

// lib
import type { McpAccess, McpArea, OAuthRequestDto } from "lib";

/** What the consent page shows. */
export enum ConsentStatus {
  Loading = "loading",
  /** Missing, unknown, expired or already used request (404). */
  NotFound = "notFound",
  /** The session token was rejected: sign in again and come back. */
  SessionExpired = "sessionExpired",
  Error = "error",
  Ready = "ready",
}

/** The user's answer to the authorization request. */
export enum ConsentDecision {
  Approve = "approve",
  Deny = "deny",
}

export interface ConsentStatusInput {
  requestId: string | null;
  isLoading: boolean;
  error: unknown;
  hasRequest: boolean;
  /** The decision call answered 404 (request expired meanwhile). */
  decisionExpired: boolean;
}

export interface UseConsentDecisionReturnType {
  /** Access level sent with Allow (read and write by default). */
  access: McpAccess;
  setAccess: (access: McpAccess) => void;
  /** Areas sent with Allow (every area by default; at least one). */
  areas: McpArea[];
  setAreas: (areas: McpArea[]) => void;
  decide: (decision: ConsentDecision) => void;
  /** Decision being sent, or already sent and redirecting. */
  pendingDecision: ConsentDecision | null;
  /** True while sending and after success (the page is navigating away). */
  isSubmitting: boolean;
  expired: boolean;
}

export interface ConsentCardPropsType {
  children: ReactNode;
  className?: string;
}

export interface ConsentRequestPropsType {
  request: OAuthRequestDto;
  email: string;
  access: McpAccess;
  onAccessChange: (access: McpAccess) => void;
  areas: McpArea[];
  onAreasChange: (areas: McpArea[]) => void;
  pendingDecision: ConsentDecision | null;
  isSubmitting: boolean;
  onDecide: (decision: ConsentDecision) => void;
  onSwitchAccount: () => void;
}
