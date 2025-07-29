import { Outlet } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { ErrorBoundary } from "react-error-boundary";
import { useEffect } from "react";

// providers
import { useAuth } from "providers";

// components
import Header from "./Header";
import Footer from "./Footer";
import { Notification, Error } from "components";

export function View() {
  const { account } = useAuth();
  useEffect(() => {
    console.log(account);
  }, [account]);

  return (
    <>
      <Header />
      <ErrorBoundary
        fallback={
          <main>
            <Error />
          </main>
        }
      >
        <Outlet />
      </ErrorBoundary>
      <Footer />
      <Notification />
      <Tooltip id="tooltip" />
    </>
  );
}
