import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

// @sito/dashboard-app
import { Error as ErrorView, Loading, useAuth } from "@sito/dashboard-app";

// hooks
import { useOAuthRequest } from "hooks";

// lib
import { AppRoutes, RouteQueryParam, saveReturnTo } from "lib";

// components
import { ConsentCard, ConsentNotFound, ConsentRequest } from "./components";

// hooks
import { useConsentDecision } from "./hooks";

// utils
import { getConsentStatus } from "./utils";

// types
import { ConsentStatus } from "./types";

import "./styles.css";

/**
 * OAuth consent (`/oauth/consent?request=<id>`): an AI app such as ChatGPT or
 * claude.ai asks to reach the wallet MCP server on the user's behalf.
 */
export function OAuthConsent() {
  const { t } = useTranslation();
  const { account } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get(RouteQueryParam.oauthRequest) || null;

  const requestQuery = useOAuthRequest(requestId);
  const decision = useConsentDecision(requestId);

  const status = getConsentStatus({
    requestId,
    isLoading: requestQuery.isLoading,
    error: requestQuery.error,
    hasRequest: !!requestQuery.data,
    decisionExpired: decision.expired,
  });

  // Sign out and in again (same or another account), then come back here.
  const signInAgain = useCallback(() => {
    saveReturnTo(`${location.pathname}${location.search}`);
    navigate(AppRoutes.signOut);
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    if (status !== ConsentStatus.SessionExpired) return;
    signInAgain();
  }, [signInAgain, status]);

  if (status === ConsentStatus.NotFound) return <ConsentNotFound />;

  if (status === ConsentStatus.Error)
    return (
      <ConsentCard>
        <ErrorView
          message={t("_pages:oauthConsent.errors.load")}
          onRetry={() => void requestQuery.refetch()}
        />
      </ConsentCard>
    );

  if (status !== ConsentStatus.Ready || !requestQuery.data)
    return (
      <ConsentCard className="oauth-consent-card--centered">
        <Loading />
        <p className="oauth-consent-muted">
          {t("_pages:oauthConsent.loading")}
        </p>
      </ConsentCard>
    );

  return (
    <ConsentRequest
      request={requestQuery.data}
      email={account.email ?? ""}
      pendingDecision={decision.pendingDecision}
      isSubmitting={decision.isSubmitting}
      onDecide={decision.decide}
      onSwitchAccount={signInAgain}
    />
  );
}
