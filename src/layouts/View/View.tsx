import { Outlet } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { ErrorBoundary } from "react-error-boundary";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  useNotification,
} from "@sito/dashboard-app";
import type { BottomNavigationItemType } from "@sito/dashboard-app";

// providers
import { useFeatureFlags, useManager } from "providers";
import { useAppPreload, useOnlineStatus } from "hooks";

// components
import { OfflineBanner } from "components";
import {
  OnboardingEntitySelection,
  configsToEnabledEntityKeys,
  entityKeysToConfigs,
  entityKeysToOnboardingSetupStepKeys,
  resolveRequiredEntityKeys,
  toggleSelectedEntityKey,
} from "./components/OnboardingEntitySelection";
import { OnboardingSetup } from "./components/OnboardingSetup";
import { WalletOnboarding } from "./components/WalletOnboarding";

// config
import { config } from "../../config";
import { getFeatureFilteredBottomMap } from "../../views/bottomMap";
import {
  USER_ENTITY_CONFIG_KEYS,
  type UserEntityConfigKey,
  isAnonymousVisitorSession,
  userEntityConfigsToFeaturePayload,
} from "lib";
import { getFeatureFilteredMenuMap } from "views/menuMap";

export function View() {
  const { loading: preloadLoading } = useAppPreload();
  const { t, i18n } = useTranslation();
  const { account, isInGuestMode } = useAuth();
  const { showErrorNotification } = useNotification();
  const manager = useManager();
  const isOnline = useOnlineStatus();
  const { applyFeaturePayload, isFeatureEnabled } = useFeatureFlags();
  const onboardingStorageKey =
    typeof config.onboarding === "string" ? config.onboarding : "onboarding";
  const isAnonymousVisitor = isAnonymousVisitorSession(
    account,
    isInGuestMode(),
  );
  const isLoggedSession = Boolean(account?.id) && !isInGuestMode();
  const [selectedEntityKeys, setSelectedEntityKeys] = useState<
    UserEntityConfigKey[]
  >(() => [...USER_ENTITY_CONFIG_KEYS]);
  const [confirmedEntityKeys, setConfirmedEntityKeys] = useState<
    UserEntityConfigKey[]
  >(() => [...USER_ENTITY_CONFIG_KEYS]);

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
        setSelectedEntityKeys(resolvedEntityKeys);
        setConfirmedEntityKeys(resolvedEntityKeys);
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

  const handleToggleEntity = useCallback((entityKey: UserEntityConfigKey) => {
    setSelectedEntityKeys((previous) =>
      toggleSelectedEntityKey(previous, entityKey),
    );
  }, []);

  const handleEntitiesNext = useCallback(async () => {
    if (selectedEntityKeys.length === 0) {
      showErrorNotification({
        message: t("_pages:onboarding.entities.errors.empty"),
      });

      return false;
    }

    const resolvedEntityKeys = resolveRequiredEntityKeys(selectedEntityKeys);
    const configs = entityKeysToConfigs(resolvedEntityKeys);

    if (isLoggedSession && isOnline) {
      try {
        await manager.UserEntityConfigs.putBatch({ entities: configs });
      } catch {
        showErrorNotification({
          message: t("_accessibility:errors.500"),
        });

        return false;
      }
    }

    setConfirmedEntityKeys(resolvedEntityKeys);
    applyFeaturePayload(userEntityConfigsToFeaturePayload(configs));

    return true;
  }, [
    applyFeaturePayload,
    isLoggedSession,
    isOnline,
    manager.UserEntityConfigs,
    selectedEntityKeys,
    showErrorNotification,
    t,
  ]);

  const onboardingSetupStepKeys = useMemo(
    () => entityKeysToOnboardingSetupStepKeys(confirmedEntityKeys),
    [confirmedEntityKeys],
  );

  const onboardingSteps = useMemo(
    () => [
      {
        key: "welcome",
        title: t("_pages:onboarding.welcome.title"),
        body: t("_pages:onboarding.welcome.body"),
      },
      {
        key: "entities",
        title: t("_pages:onboarding.entities.title"),
        body: t("_pages:onboarding.entities.body"),
        content: (
          <OnboardingEntitySelection
            selectedEntityKeys={selectedEntityKeys}
            onToggleEntity={handleToggleEntity}
          />
        ),
        beforeNext: handleEntitiesNext,
      },
      ...onboardingSetupStepKeys.map((stepKey) => ({
        key: stepKey,
        title: t(`_pages:onboarding.${stepKey}.title`),
        body: t(`_pages:onboarding.${stepKey}.body`),
        content: <OnboardingSetup stepKey={stepKey} />,
      })),
      {
        key: "get_started",
        title: t("_pages:onboarding.get_started.title"),
        body: t("_pages:onboarding.get_started.body"),
      },
    ],
    [
      handleEntitiesNext,
      handleToggleEntity,
      onboardingSetupStepKeys,
      selectedEntityKeys,
      t,
    ],
  );

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
          <WalletOnboarding remountStepOnChange steps={onboardingSteps} />
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
