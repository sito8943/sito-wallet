import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// @sito/dashboard-app
import { toLocal, useAuth } from "@sito/dashboard-app";

// providers / hooks
import { useFeatureFlags, useManager } from "providers";
import { useOnlineStatus } from "hooks";

// lib
import {
  AppRoutes,
  type UserEntityConfigKey,
  userEntityConfigsToFeaturePayload,
} from "lib";

// components
import {
  configsToEnabledEntityKeys,
  entityKeysToConfigs,
  resolveRequiredEntityKeys,
} from "../components";

// config
import { config } from "../../../config";

const resolveOnboardingStorageKey = (): string =>
  typeof config.onboarding === "string" ? config.onboarding : "onboarding";

export function useOnboarding() {
  const navigate = useNavigate();
  const manager = useManager();
  const isOnline = useOnlineStatus();
  const { account } = useAuth();
  const { applyFeaturePayload } = useFeatureFlags();

  const isLoggedSession = Boolean(account?.id);
  const [initialEnabledEntityKeys, setInitialEnabledEntityKeys] = useState<
    UserEntityConfigKey[] | undefined
  >(undefined);

  // Only logged sessions have persisted entity configs to preload; guests start
  // from the full default set handled by the wizard.
  useEffect(() => {
    if (!isLoggedSession || !isOnline) return;

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
  ]);

  // Mark onboarding as seen only when the user actually leaves the wizard, then
  // route to sign-in. Marking on mount would let a mid-onboarding reload/redirect
  // count as "seen".
  const handleExit = useCallback(() => {
    toLocal(resolveOnboardingStorageKey(), true);
    navigate(AppRoutes.signIn, { replace: true });
  }, [navigate]);

  return { initialEnabledEntityKeys, handleExit };
}
