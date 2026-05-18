import type { To } from "react-router-dom";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { ErrorBoundary } from "react-error-boundary";
import type { ComponentType} from "react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import {
  BottomNavActionProvider,
  BottomNavigation,
  ConfigProvider,
  Error,
  Onboarding,
  TableOptionsProvider,
  NavbarProvider,
  Notification,
  SplashScreen,
  useAuth,
} from "@sito/dashboard-app";
import type { BottomNavigationItemType ,
  BaseLinkPropsType,
  OnboardingStepType} from "@sito/dashboard-app";

// providers
import { fromLocal, toLocal } from "@sito/dashboard-app";
import { useAppPreload } from "hooks";

// components
import { SearchModal } from "components";
import Header from "./Header";
import Footer from "./Footer";
import { OnboardingSetup } from "./components/OnboardingSetup";

// config
import { config } from "../../config";
import { bottomMap } from "../../views/bottomMap";
import { isAnonymousVisitorSession } from "lib";

const onboardingStepKeys = [
  "welcome",
  "currencies",
  "accounts",
  "transactions",
  "get_started",
];

export function View() {
  const { loading: preloadLoading } = useAppPreload();
  const { t } = useTranslation();
  const { account, isInGuestMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const onboardingStorageKey =
    typeof config.onboarding === "string" ? config.onboarding : "onboarding";
  const isAnonymousVisitor = isAnonymousVisitorSession(
    account,
    isInGuestMode(),
  );

  const showOnboarding =
    isAnonymousVisitor || !fromLocal(onboardingStorageKey);
  const onboardingSteps = useMemo<OnboardingStepType[]>(
    () =>
      onboardingStepKeys.map((stepKey) => ({
        title: t(`_pages:onboarding.${stepKey}.title`),
        body: t(`_pages:onboarding.${stepKey}.body`),
        content:
          stepKey === "currencies" ||
          stepKey === "accounts" ||
          stepKey === "transactions" ? (
            <OnboardingSetup stepKey={stepKey} />
          ) : undefined,
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
    if (showOnboarding && !isAnonymousVisitor) {
      toLocal(onboardingStorageKey, true);
    }
  }, [isAnonymousVisitor, onboardingStorageKey, showOnboarding]);

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
