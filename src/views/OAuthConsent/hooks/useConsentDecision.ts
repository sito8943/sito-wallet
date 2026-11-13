import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";

// @sito/dashboard-app
import { useNotification } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// lib
import {
  DEFAULT_MCP_ACCESS,
  MCP_AREAS,
  isHttpUrl,
  toMcpAreasPayload,
  type McpAccess,
  type McpArea,
} from "lib";

// constants
import { CONSENT_NOT_FOUND_STATUS } from "../constants";

// utils
import { hasHttpStatus } from "../utils";

// types
import { ConsentDecision, type UseConsentDecisionReturnType } from "../types";

/**
 * Keeps the chosen access level and areas, sends Allow (with them) or Deny to
 * sito-auth and leaves for the client's redirect URL
 * (with the code, or with `error=access_denied`).
 */
export function useConsentDecision(
  requestId: string | null,
): UseConsentDecisionReturnType {
  const { t } = useTranslation();
  const manager = useManager();
  const { showErrorNotification } = useNotification();
  const [expired, setExpired] = useState(false);
  const [access, setAccess] = useState<McpAccess>(DEFAULT_MCP_ACCESS);
  const [areas, setAreas] = useState<McpArea[]>(() => [...MCP_AREAS]);

  const mutation = useMutation({
    mutationFn: (decision: ConsentDecision) => {
      const id = requestId ?? "";
      return decision === ConsentDecision.Approve
        ? manager.OAuth.approve(id, access, toMcpAreasPayload(areas))
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
      // Allow needs at least one area (the button is disabled meanwhile).
      if (decision === ConsentDecision.Approve && !areas.length) return;
      mutate(decision);
    },
    [areas.length, isSubmitting, mutate, requestId],
  );

  return {
    access,
    setAccess,
    areas,
    setAreas,
    decide,
    pendingDecision: isSubmitting ? (variables ?? null) : null,
    isSubmitting,
    expired,
  };
}
