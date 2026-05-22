import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// @sito/dashboard-app
import { useAuth, SplashScreen } from "@sito/dashboard-app";

// providers
import { useFeatureFlags } from "providers";

// lib
import {
  AppRoutes,
  clearPersistedPublicSessionAccount,
  clearAllTableOptions,
} from "lib";

/**
 * SignOut page
 * @returns SignOut page component
 */
export function SignOut() {
  const { logoutUser } = useAuth();
  const { clearFeatures } = useFeatureFlags();

  const navigate = useNavigate();

  const logic = useCallback(async () => {
    try {
      clearPersistedPublicSessionAccount();
      clearAllTableOptions();
      clearFeatures();
      await logoutUser();
    } catch (error) {
      console.error("Error during sign out:", error);
    }

    setTimeout(() => {
      navigate(AppRoutes.signIn);
    }, 1000);
  }, [clearFeatures, logoutUser, navigate]);

  useEffect(() => {
    void logic();
  }, [logic]);

  return <SplashScreen />;
}
