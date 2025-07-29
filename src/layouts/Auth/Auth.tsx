import { ErrorBoundary } from "react-error-boundary";
import { Outlet, useNavigate } from "react-router-dom";

// providers
import { useAuth } from "providers";

// components
import { Notification, Error } from "components";
import { useEffect } from "react";

export const Auth = () => {
  const { account } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (account?.email) navigate("/");
  }, [account?.email, navigate]);

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
