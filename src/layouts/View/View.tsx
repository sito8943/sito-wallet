import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { ErrorBoundary } from "react-error-boundary";
import { useEffect, useState } from "react";

import { TableOptionsProvider, TranslationProvider } from "@sito/dashboard";

// providers
import { useAuth, fromLocal, toLocal } from "@sito/dashboard-app";

// components
import { Notification, Error, Onboarding, ToTop } from "components";
import Header from "./Header";
import Footer from "./Footer";

// config
import { config } from "../../config";

export function View() {
  const { account, isInGuestMode } = useAuth();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const onboarding = fromLocal(config.onboarding);

    if (!onboarding) {
      setShowOnboarding(true);
      toLocal(config.onboarding, true);
    }
    if (!account.email && !isInGuestMode() && onboarding)
      navigate("/auth/sign-in");
  }, [account.email, isInGuestMode, navigate]);

  return (
    <>
      {showOnboarding && <Onboarding />}
      <ToTop />
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
