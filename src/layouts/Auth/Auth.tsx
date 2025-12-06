import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet, useNavigate } from "react-router-dom";

// @sito/dashboard-app
import { Notification, Error } from "@sito/dashboard-app";

// providers
import { useAuth } from "providers";

export const Auth = () => {
  const { account } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (account.email) navigate("/");
  }, [account, navigate]);

  return (
    <>
      <ErrorBoundary FallbackComponent={Error}>
        <Outlet />
      </ErrorBoundary>
      <Notification />
    </>
  );
};
