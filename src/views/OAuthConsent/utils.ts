import { isHttpError } from "@sito/dashboard-app";

import {
  CONSENT_NOT_FOUND_STATUS,
  CONSENT_UNAUTHORIZED_STATUS,
} from "./constants";
import { ConsentStatus, type ConsentStatusInput } from "./types";

/** True when `error` is an HTTP error with that status. */
export const hasHttpStatus = (error: unknown, status: number): boolean =>
  isHttpError(error) && error.status === status;

/** Which state the consent page shows. */
export const getConsentStatus = (input: ConsentStatusInput): ConsentStatus => {
  const { requestId, isLoading, error, hasRequest, decisionExpired } = input;

  if (!requestId || decisionExpired) return ConsentStatus.NotFound;
  if (error) {
    if (hasHttpStatus(error, CONSENT_NOT_FOUND_STATUS))
      return ConsentStatus.NotFound;
    if (hasHttpStatus(error, CONSENT_UNAUTHORIZED_STATUS))
      return ConsentStatus.SessionExpired;
    return ConsentStatus.Error;
  }
  if (isLoading || !hasRequest) return ConsentStatus.Loading;
  return ConsentStatus.Ready;
};
