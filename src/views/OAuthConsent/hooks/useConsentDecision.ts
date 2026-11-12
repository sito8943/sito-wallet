import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";

// @sito/dashboard-app
import { useNotification } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// lib
import { isHttpUrl } from "lib";

// constants
import { CONSENT_NOT_FOUND_STATUS } from "../constants";

// utils
import { hasHttpStatus } from "../utils";

// types
import { ConsentDecision, type UseConsentDecisionReturnType } from "../types";

/**
 * Sends Allow/Deny to sito-auth and leaves for the client's redirect URL
 * (with the code, or with `error=access_denied`).
 */
export function useConsentDecision(
  requestId: string | null,
): UseConsentDecisionReturnType {
  const { t } = useTranslation();
  const manager = useManager();
  const { showErrorNotification } = useNotification();
  const [expired, setExpired] = useState(false);

  const mutation = useMutation({
    mutationFn: (decision: ConsentDecision) => {
      const id = requestId ?? "";
      return decision === ConsentDecision.Approve
        ? manager.OAuth.approve(id)
        : manager.OAuth.deny(id);
    },
    onSuccess: ({ redirectUrl }) => {
      if (!isHttpUrl(redirectUrl)) {
        showErrorNotification({
          message: t("_pages:oauthConsent.errors.invalidRedirect"),
        });
        return;
      }
      window.location.assign(redirectUrl);
    },
    onError: (error) => {
      if (hasHttpStatus(error, CONSENT_NOT_FOUND_STATUS)) {
        setExpired(true);
        return;
      }
      showErrorNotification({
        message: t("_pages:oauthConsent.errors.decision"),
      });
    },
  });

  const { mutate, isPending, isSuccess, data, variables } = mutation;
  // After a valid answer the browser is leaving: keep the buttons locked.
  const isRedirecting = isSuccess && isHttpUrl(data?.redirectUrl);
  const isSubmitting = isPending || isRedirecting;

  const decide = useCallback(
    (decision: ConsentDecision) => {
      if (!requestId || isSubmitting) return;
      mutate(decision);
    },
    [isSubmitting, mutate, requestId],
  );

  return {
    decide,
    pendingDecision: isSubmitting ? (variables ?? null) : null,
    isSubmitting,
    expired,
  };
}
