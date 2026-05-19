import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

// @sito/dashboard-app
import { AuthShell, Error, useAuth } from "@sito/dashboard-app";

// lib
import { AppRoutes } from "lib";

// constants
import { publicAuthRoutes } from "./constants";

export const Auth = () => {
  const { account } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!account.email) return;
    if (publicAuthRoutes.has(location.pathname as string)) return;

    navigate(AppRoutes.home);
  }, [account.email, location.pathname, navigate]);

  return (
    <AuthShell>
      <ErrorBoundary FallbackComponent={Error}>
        <Outlet />
      </ErrorBoundary>
    </AuthShell>
  );
};
