import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";

// components
import { Notification, Error } from "components";

export const Auth = () => {
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
