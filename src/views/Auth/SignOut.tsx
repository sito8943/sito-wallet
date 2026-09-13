import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// react-query
import { useQueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import { useAuth, SplashScreen } from "@sito/dashboard-app";

// providers
import { clearPersistedQueryCache, useFeatureFlags } from "providers";

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
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const logic = useCallback(async () => {
    try {
      clearPersistedPublicSessionAccount();
      clearAllTableOptions();
      clearFeatures();
      // The persisted cache holds this account's data, so it leaves with it.
      queryClient.clear();
      clearPersistedQueryCache();
      await logoutUser();
    } catch (error) {
      console.error("Error during sign out:", error);
    }

    setTimeout(() => {
      navigate(AppRoutes.signIn);
    }, 1000);
  }, [clearFeatures, logoutUser, navigate, queryClient]);

  useEffect(() => {
    void logic();
  }, [logic]);

  return <SplashScreen />;
}
