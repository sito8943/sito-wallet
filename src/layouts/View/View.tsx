import { Outlet, useNavigate, useLocation, Link, To } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { ErrorBoundary } from "react-error-boundary";
import { ComponentType, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import {
  BaseLinkPropsType,
  BottomNavActionProvider,
  BottomNavigation,
  ConfigProvider,
  Error,
  Onboarding,
  TableOptionsProvider,
  NavbarProvider,
  OnboardingStepType,
  Notification,
  SplashScreen,
} from "@sito/dashboard-app";
import type { BottomNavigationItemType } from "@sito/dashboard-app";

// providers
import { useAuth, fromLocal, toLocal } from "@sito/dashboard-app";
import { useAppPreload } from "hooks";

// components
import { SearchModal } from "components";
import Header from "./Header";
import Footer from "./Footer";

// config
import { config } from "../../config";
import { bottomMap } from "../../views/bottomMap";

const onboardingStepKeys = [
  "welcome",
  "currencies",
  "accounts",
  "transactions",
  "get_started",
];

export function View() {
  const { account, isInGuestMode } = useAuth();
  const { loading: preloadLoading } = useAppPreload();
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

  const bottomNavigationItems = useMemo<BottomNavigationItemType[]>(
    () =>
      bottomMap.map((item) => {
        const label = t(`_pages:${item.page}.title`);

        return {
          id: item.id,
          to: item.to,
          icon: item.icon,
          position: item.position,
          label,
          ariaLabel: label,
        };
      }),
    [t],
  );

  const isBottomNavItemActive = (
    pathname: string,
    item: BottomNavigationItemType,
  ) => (item.to === "/" ? pathname === "/" : pathname.startsWith(item.to));

  useEffect(() => {
    if (showOnboarding) {
      toLocal(config.onboarding, true);
    }
  }, [account.email, isInGuestMode, navigate, showOnboarding]);

  if (preloadLoading) return <SplashScreen />;

  return (
    <ConfigProvider
      navigate={(route) => navigate(route as To)}
      location={location}
      linkComponent={Link as unknown as ComponentType<BaseLinkPropsType>}
      searchComponent={SearchModal}
    >
      <NavbarProvider>
        <BottomNavActionProvider>
          {showOnboarding && <Onboarding steps={onboardingSteps} />}
          <Header />
          <ErrorBoundary FallbackComponent={Error}>
            <TableOptionsProvider>
              <Outlet />
            </TableOptionsProvider>
          </ErrorBoundary>
          <Footer />
          <BottomNavigation
            items={bottomNavigationItems}
            isItemActive={isBottomNavItemActive}
          />
          <Tooltip id="tooltip" />
          <Notification />
        </BottomNavActionProvider>
      </NavbarProvider>
    </ConfigProvider>
  );
}
