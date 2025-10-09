import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { ErrorBoundary } from "react-error-boundary";
import { useEffect, useState } from "react";

import { TableOptionsProvider, TranslationProvider } from "@sito/dashboard";

// providers
import { useAuth } from "providers";

// lib
import { fromLocal, toLocal } from "lib";

// components
import { Notification, Error, Onboarding, ToTop, SearchModal } from "components";
import Header from "./Header";
import Footer from "./Footer";

// config
import { config } from "../../config";

export function View() {
  const { account, isInGuestMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  console.log(location.pathname)

  return (
    <>
      {showOnboarding && <Onboarding />}
      {location.pathname !== "/" && <SearchModal />}
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
