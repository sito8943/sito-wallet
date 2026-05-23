import { Outlet } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { ErrorBoundary } from "react-error-boundary";
import { useEffect, useMemo, useState } from "react";
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
  toLocal,
  useAuth,
} from "@sito/dashboard-app";
import type { BottomNavigationItemType } from "@sito/dashboard-app";

// providers
import { useFeatureFlags, useManager } from "providers";
import { useAppPreload, useOnlineStatus } from "hooks";

// components
import { OfflineBanner } from "components";
import {
  configsToEnabledEntityKeys,
  entityKeysToConfigs,
  resolveRequiredEntityKeys,
} from "./components/OnboardingEntitySelection";
import { WalletOnboardingWizard } from "./components/WalletOnboardingWizard";

// config
import { config } from "../../config";
import { getFeatureFilteredBottomMap } from "../../views/bottomMap";
import {
  type UserEntityConfigKey,
  isAnonymousVisitorSession,
  userEntityConfigsToFeaturePayload,
} from "lib";
import { getFeatureFilteredMenuMap } from "views/menuMap";

export function View() {
  const { loading: preloadLoading } = useAppPreload();
  const { t, i18n } = useTranslation();
  const { account } = useAuth();
  const manager = useManager();
  const isOnline = useOnlineStatus();
  const { applyFeaturePayload, isFeatureEnabled } = useFeatureFlags();
  const onboardingStorageKey =
    typeof config.onboarding === "string" ? config.onboarding : "onboarding";
  const isAnonymousVisitor = isAnonymousVisitorSession(account);
  const isLoggedSession = Boolean(account?.id);
  const [initialEnabledEntityKeys, setInitialEnabledEntityKeys] = useState<
    UserEntityConfigKey[] | undefined
  >(undefined);

  const showOnboarding = isAnonymousVisitor || !fromLocal(onboardingStorageKey);

  useEffect(() => {
    if (!showOnboarding || !isLoggedSession || !isOnline) return;

    let mounted = true;

    manager.UserEntityConfigs.getAll()
      .then((configs) => {
        if (!mounted || configs.length === 0) return;

        const enabledEntityKeys = configsToEnabledEntityKeys(configs);
        if (enabledEntityKeys.length === 0) return;

        const resolvedEntityKeys = resolveRequiredEntityKeys(enabledEntityKeys);
        const resolvedConfigs = entityKeysToConfigs(resolvedEntityKeys);
        setInitialEnabledEntityKeys(resolvedEntityKeys);
        applyFeaturePayload(userEntityConfigsToFeaturePayload(resolvedConfigs));
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [
    applyFeaturePayload,
    isLoggedSession,
    isOnline,
    manager.UserEntityConfigs,
    showOnboarding,
  ]);

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

  useEffect(() => {
    if (showOnboarding && !isAnonymousVisitor) {
      toLocal(onboardingStorageKey, true);
    }
  }, [isAnonymousVisitor, onboardingStorageKey, showOnboarding]);

  if (preloadLoading) return <SplashScreen />;

  return (
    <NavbarProvider>
      <BottomNavActionProvider>
        {showOnboarding && (
          <WalletOnboardingWizard
            initialEnabledEntityKeys={initialEnabledEntityKeys}
          />
        )}
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
