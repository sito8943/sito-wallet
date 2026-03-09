import { Outlet, useNavigate, useLocation, Link, To } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { ErrorBoundary } from "react-error-boundary";
import { ComponentType, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import {
  BaseLinkPropsType,
  ConfigProvider,
  Error,
  ToTop,
  Onboarding,
  TableOptionsProvider,
  NavbarProvider,
  OnboardingStepType,
} from "@sito/dashboard-app";

// providers
import { useAuth, fromLocal, toLocal } from "@sito/dashboard-app";

// components
import { SearchModal } from "components";
import Header from "./Header";
import Footer from "./Footer";

// config
import { config } from "../../config";

const onboardingStepKeys = [
  "welcome",
  "currencies",
  "accounts",
  "transactions",
  "get_started",
];

export function View() {
  const { account, isInGuestMode } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [showOnboarding] = useState(() => !fromLocal(config.onboarding));
  const onboardingSteps = useMemo<OnboardingStepType[]>(
    () =>
      onboardingStepKeys.map((stepKey) => ({
        title: t(`_pages:onboarding.${stepKey}.title`),
        body: t(`_pages:onboarding.${stepKey}.body`),
      })),
    [t],
  );

  useEffect(() => {
    if (showOnboarding) {
      toLocal(config.onboarding, true);
    }
  }, [account.email, isInGuestMode, navigate, showOnboarding]);

  return (
    <ConfigProvider
      navigate={(route) => navigate(route as To)}
      location={location}
      linkComponent={Link as unknown as ComponentType<BaseLinkPropsType>}
      searchComponent={SearchModal}
    >
      <NavbarProvider>
        {showOnboarding && <Onboarding steps={onboardingSteps} />}
        <ToTop />
        <Header />
        <ErrorBoundary FallbackComponent={Error}>
          <TableOptionsProvider>
            <Outlet />
          </TableOptionsProvider>
        </ErrorBoundary>
        <Footer />
        <Tooltip id="tooltip" />
      </NavbarProvider>
    </ConfigProvider>
  );
}
