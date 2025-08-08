import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { ErrorBoundary } from "react-error-boundary";
import { useEffect } from "react";

import { TableOptionsProvider, TranslationProvider } from "@sito/dashboard";

// providers
import { useAuth } from "providers";

// components
import Header from "./Header";
import Footer from "./Footer";
import { Notification, Error } from "components";

export function View() {
  const { account, isInGuestMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!account.email && !isInGuestMode()) navigate("/auth/sign-in");
  }, [account, isInGuestMode, navigate]);

  const { t } = useTranslation();

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
        <TableOptionsProvider>
          <TranslationProvider t={t}>
            <Outlet />
          </TranslationProvider>
        </TableOptionsProvider>
      </ErrorBoundary>
      <Footer />
      <Notification />
      <Tooltip id="tooltip" />
    </>
  );
}
