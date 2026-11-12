import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

// @sito/dashboard-app
import { AuthShell, useAuth } from "@sito/dashboard-app";

// components
import { QueryError } from "components";

// lib
import { AppRoutes, consumeReturnTo } from "lib";

// constants
import { publicAuthRoutes } from "./constants";

export const Auth = () => {
  const { account } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!account.email) return;
    if (publicAuthRoutes.has(location.pathname)) return;

    // Signed in (just now or before): go back to the page that asked for
    // sign-in, if any. This runs after SignIn's own navigation, so it is the
    // one that consumes the stored URL.
    navigate(consumeReturnTo() ?? AppRoutes.home);
  }, [account.email, location.pathname, navigate]);

  return (
    <AuthShell>
      <ErrorBoundary FallbackComponent={QueryError}>
        <Outlet />
      </ErrorBoundary>
    </AuthShell>
  );
};
