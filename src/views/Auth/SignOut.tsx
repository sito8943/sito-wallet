import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// @sito/dashboard-app
import { useAuth, SplashScreen } from "@sito/dashboard-app";

// providers
import { useFeatureFlags, useOfflineManager } from "providers";

// lib
import { clearPersistedPublicSessionAccount } from "lib";

/**
 * SignOut page
 * @returns SignOut page component
 */
export function SignOut() {
  const { logoutUser } = useAuth();
  const { clearFeatures } = useFeatureFlags();
  const offlineManager = useOfflineManager();

  const navigate = useNavigate();

  const logic = useCallback(async () => {
    clearPersistedPublicSessionAccount();
    clearFeatures();
    await offlineManager.clearIndexedDatabases();
    await logoutUser();
    setTimeout(() => {
      navigate("/auth/sign-in");
    }, 1000);
  }, [clearFeatures, logoutUser, navigate, offlineManager]);

  useEffect(() => {
    logic();
  }, [logic]);

  return <SplashScreen />;
}
