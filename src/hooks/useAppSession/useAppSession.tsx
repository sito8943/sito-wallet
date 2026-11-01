import { isHttpError, useAuth } from "@sito/dashboard-app";
import { useEffect, useRef, useState } from "react";

import { useFeatureFlags, useManager } from "providers";
import {
  clearPersistedPublicSessionAccount,
  readStoredRememberMe,
  readStoredSessionFromSnapshot,
} from "lib";

import { useOnlineStatus } from "../useOnlineStatus";

import { SESSION_BOOTSTRAP_TIMEOUT_MS } from "./constants";

export const useAppSession = (): boolean => {
  const { logUser, logoutUser } = useAuth();
  const { clearFeatures } = useFeatureFlags();
  const manager = useManager();
  const isOnline = useOnlineStatus();
  const [loading, setLoading] = useState(true);

  const bootstrapContextRef = useRef({
    logUser,
    logoutUser,
    manager,
    clearFeatures,
  });
  const initialIsOnlineRef = useRef(isOnline);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: number | undefined;

    const finishLoading = () => {
      window.clearTimeout(timeoutId);
      window.setTimeout(() => {
        if (isMounted) setLoading(false);
      }, 300);
    };

    const bootstrapSession = async () => {
      const rememberedSession = readStoredSessionFromSnapshot();
      const rememberMe = readStoredRememberMe();

      if (!initialIsOnlineRef.current) {
        if (rememberedSession) {
          bootstrapContextRef.current.logUser(rememberedSession, rememberMe);
        }
        finishLoading();
        return;
      }

      // A hung request would keep the splash forever: stop waiting, keep the
      // stored session like offline does. A late answer still applies.
      timeoutId = window.setTimeout(() => {
        if (!isMounted) return;
        if (rememberedSession) {
          bootstrapContextRef.current.logUser(rememberedSession, rememberMe);
        }
        finishLoading();
      }, SESSION_BOOTSTRAP_TIMEOUT_MS);

      try {
        const session =
          await bootstrapContextRef.current.manager.Auth.getSession();

        if (!isMounted) return;

        bootstrapContextRef.current.logUser(session, rememberMe);
      } catch (error) {
        if (!isMounted) return;

        try {
          if (
            rememberedSession &&
            (!isHttpError(error) || error.status !== 401)
          ) {
            bootstrapContextRef.current.logUser(rememberedSession, rememberMe);
          } else {
            clearPersistedPublicSessionAccount();
            bootstrapContextRef.current.clearFeatures();
            await bootstrapContextRef.current.logoutUser();
          }
        } catch (err) {
          console.error("Error during session bootstrap cleanup:", err);
        }
      } finally {
        finishLoading();
      }
    };

    bootstrapSession().catch(() => {
      finishLoading();
    });

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return loading;
};
