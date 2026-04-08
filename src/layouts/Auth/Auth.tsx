import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet, useNavigate } from "react-router-dom";

// @sito/dashboard-app
import { Error, Notification } from "@sito/dashboard-app";

// providers
import { useAuth } from "@sito/dashboard-app";
import { AppRoutes } from "lib";

export const Auth = () => {
  const { account } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (account.email) navigate(AppRoutes.home);
  }, [account, navigate]);

  return (
    <ErrorBoundary FallbackComponent={Error}>
      <Outlet />
      <Notification />
    </ErrorBoundary>
  );
};
