import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet, useNavigate } from "react-router-dom";

// components
import { Notification, Error } from "components";

// providers
import { useAuth } from "@sito/dashboard-app";

export const Auth = () => {
  const { account } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (account.email) navigate("/");
  }, [account, navigate]);

  return (
    <>
      <ErrorBoundary
        fallback={
          <main>
            <Error />
          </main>
        }
      >
        <Outlet />
      </ErrorBoundary>
      <Notification />
    </>
  );
};
