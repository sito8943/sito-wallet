import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// @sito/dashboard-app
import { useAuth, SplashScreen } from "@sito/dashboard-app";

// providers
import { useFeatureFlags, useOfflineManager } from "providers";

// lib
import { clearPersistedPublicSessionAccount, clearAllTableOptions } from "lib";

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
    try {
      clearPersistedPublicSessionAccount();
      clearAllTableOptions();
      clearFeatures();
      await offlineManager.clearIndexedDatabases();
      await logoutUser();
    } catch (error) {
      // do nothing, we want to try to clear as much as possible even if some steps fail
      console.error("Error during sign out:", error);
    }

    setTimeout(() => {
      navigate("/auth/sign-in");
    }, 1000);
  }, [clearFeatures, logoutUser, navigate, offlineManager]);

  useEffect(() => {
    logic();
  }, [logic]);

  return <SplashScreen />;
}
