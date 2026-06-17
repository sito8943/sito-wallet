import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { ErrorBoundary } from "react-error-boundary";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import {
  AppShell,
  BottomNavActionProvider,
  BottomNavigation,
  DashboardFooter,
  DashboardHeader,
  Error,
  fromLocal,
  NavbarProvider,
  SplashScreen,
  TableOptionsProvider,
  useAuth,
} from "@sito/dashboard-app";
import type { BottomNavigationItemType } from "@sito/dashboard-app";

// providers
import { useFeatureFlags } from "providers";
import { useAppPreload } from "hooks";

// components
import { OfflineBanner } from "components";

// config
import { config } from "../../config";
import { getFeatureFilteredBottomMap } from "../../views/bottomMap";
import { AppRoutes, isAnonymousVisitorSession } from "lib";
import { getFeatureFilteredMenuMap } from "views/menuMap";

// Routes an anonymous visitor may browse without being redirected. Home is
// intentionally excluded: this app is for authenticated users, so an empty
// session on "/" (e.g. an expired token) must be sent to sign-in.
const PUBLIC_ANONYMOUS_ROUTES = new Set([
  AppRoutes.about,
  AppRoutes.cookiesPolicy,
  AppRoutes.privacyPolicy,
  AppRoutes.termsAndConditions,
]);

export function View() {
  const { loading: preloadLoading } = useAppPreload();
  const { t, i18n } = useTranslation();
  const { account } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isFeatureEnabled } = useFeatureFlags();
  const onboardingStorageKey =
    typeof config.onboarding === "string" ? config.onboarding : "onboarding";
  const isAnonymousVisitor = isAnonymousVisitorSession(account);
  const hasSeenOnboarding = Boolean(fromLocal(onboardingStorageKey));

  const shouldRedirect =
    isAnonymousVisitor && !PUBLIC_ANONYMOUS_ROUTES.has(location.pathname);
  // First-time anonymous visitors go through onboarding; everyone else (e.g. an
  // expired session) goes straight to sign-in.
  const redirectTarget = hasSeenOnboarding
    ? AppRoutes.signIn
    : AppRoutes.onboarding;

  useEffect(() => {
    if (!shouldRedirect) return;

    navigate(redirectTarget, { replace: true });
  }, [navigate, redirectTarget, shouldRedirect]);

  const featureFilteredMenuMap = useMemo(
    () => getFeatureFilteredMenuMap(isFeatureEnabled, i18n.resolvedLanguage),
    [isFeatureEnabled, i18n.resolvedLanguage],
  );

  const bottomNavigationItems = useMemo<BottomNavigationItemType[]>(
    () =>
      getFeatureFilteredBottomMap(isFeatureEnabled).map((item) => {
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
    [isFeatureEnabled, t],
  );

  const isBottomNavItemActive = (
    pathname: string,
    item: BottomNavigationItemType,
  ) => (item.to === "/" ? pathname === "/" : pathname.startsWith(item.to));

  if (preloadLoading) return <SplashScreen />;
  if (shouldRedirect) return <SplashScreen />;

  return (
    <NavbarProvider>
      <BottomNavActionProvider>
        <AppShell
          header={
            <>
              <OfflineBanner />
              <DashboardHeader menuMap={featureFilteredMenuMap} />
            </>
          }
          footer={
            <DashboardFooter
              copyrightText={t("_pages:footer.copyright")}
              bottomNavSpacing
            />
          }
          bottomNavigation={
            <BottomNavigation
              items={bottomNavigationItems}
              isItemActive={isBottomNavItemActive}
              className="!bottom-0"
            />
          }
          extras={<Tooltip id="tooltip" />}
        >
          <ErrorBoundary FallbackComponent={Error}>
            <TableOptionsProvider>
              <Outlet />
            </TableOptionsProvider>
          </ErrorBoundary>
        </AppShell>
      </BottomNavActionProvider>
    </NavbarProvider>
  );
}
