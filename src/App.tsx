import { Suspense, useEffect, useRef, useState } from "react";

// components
import { isHttpError, SplashScreen, useAuth } from "@sito/dashboard-app";

// hooks
import { useOnlineStatus } from "hooks";

// providers
import { useManager } from "providers";

// routes
import { Routes } from "./Routes";

// lib
import {
  clearPersistedPublicSessionAccount,
  readStoredRememberMe,
  readStoredSessionFromSnapshot,
} from "lib";

function App() {
  const { logUser, logoutUser } = useAuth();
  const manager = useManager();
  const isOnline = useOnlineStatus();
  const [loading, setLoading] = useState(true);
  const hasInitializedSession = useRef(false);

  useEffect(() => {
    if (hasInitializedSession.current) return;

    hasInitializedSession.current = true;

    let isCancelled = false;

    const finishLoading = () => {
      setTimeout(() => {
        if (!isCancelled) setLoading(false);
      }, 300);
    };

    const bootstrapSession = async () => {
      const rememberedSession = readStoredSessionFromSnapshot();
      const rememberMe = readStoredRememberMe();

      if (!isOnline) {
        if (rememberedSession) logUser(rememberedSession, rememberMe);
        finishLoading();
        return;
      }

      try {
        const session = await manager.Auth.getSession();
        if (isCancelled) return;

        logUser(session, rememberMe);
      } catch (error) {
        if (isCancelled) return;

        if (rememberedSession && (!isHttpError(error) || error.status !== 401)) {
          logUser(rememberedSession, rememberMe);
        } else {
          clearPersistedPublicSessionAccount();
          await logoutUser();
        }
      } finally {
        if (!isCancelled) finishLoading();
      }
    };

    bootstrapSession();

    return () => {
      isCancelled = true;
    };
  }, [isOnline, logUser, logoutUser, manager]);

  return (
    <Suspense fallback={<SplashScreen />}>{!loading && <Routes />}</Suspense>
  );
}

export default App;
