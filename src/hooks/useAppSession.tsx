import { isHttpError, useAuth } from "@sito/dashboard-app";
import { useCallback, useEffect, useRef, useState } from "react";

import { useManager, useOfflineManager } from "providers";
import {
  clearPersistedPublicSessionAccount,
  readStoredRememberMe,
  readStoredSessionFromSnapshot,
} from "lib";

import { useOnlineStatus } from "./useOnlineStatus";

export const useAppSession = (): boolean => {
  const { logUser, logoutUser } = useAuth();
  const manager = useManager();
  const offlineManager = useOfflineManager();
  const isOnline = useOnlineStatus();
  const [loading, setLoading] = useState(true);

  const clearIndexedDatabases = useCallback(async () => {
    await offlineManager.clearIndexedDatabases();
  }, [offlineManager]);

  const bootstrapContextRef = useRef({
    logUser,
    logoutUser,
    manager,
    clearIndexedDatabases,
  });
  const initialIsOnlineRef = useRef(isOnline);

  bootstrapContextRef.current = {
    logUser,
    logoutUser,
    manager,
    clearIndexedDatabases,
  };

  useEffect(() => {
    let isMounted = true;

    const finishLoading = () => {
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

      try {
        const session = await bootstrapContextRef.current.manager.Auth.getSession();
        if (!isMounted) return;

        bootstrapContextRef.current.logUser(session, rememberMe);
      } catch (error) {
        if (!isMounted) return;

        if (rememberedSession && (!isHttpError(error) || error.status !== 401)) {
          bootstrapContextRef.current.logUser(rememberedSession, rememberMe);
        } else {
          clearPersistedPublicSessionAccount();
          await bootstrapContextRef.current.clearIndexedDatabases();
          await bootstrapContextRef.current.logoutUser();
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
    };
  }, []);

  return loading;
};
