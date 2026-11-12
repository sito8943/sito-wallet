import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// components
import { QueryError, SplashScreen } from "components";

// lib
import { AppRoutes, isAnonymousVisitorSession, saveReturnTo } from "lib";

// utils
import { getLocationPath } from "./utils";

import "./styles.css";

/**
 * Signed-in screens without the app chrome (header, menu, bottom nav), such
 * as the OAuth consent page. Anonymous visitors are sent to sign-in and come
 * back to the same URL (query included) afterwards.
 */
export function Standalone() {
  const { account } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAnonymousVisitor = isAnonymousVisitorSession(account);

  useEffect(() => {
    if (!isAnonymousVisitor) return;

    saveReturnTo(getLocationPath(location));
    navigate(AppRoutes.signIn, { replace: true });
  }, [isAnonymousVisitor, location, navigate]);

  if (isAnonymousVisitor) return <SplashScreen />;

  return (
    <main className="standalone-layout">
      <ErrorBoundary FallbackComponent={QueryError}>
        <Outlet />
      </ErrorBoundary>
    </main>
  );
}
