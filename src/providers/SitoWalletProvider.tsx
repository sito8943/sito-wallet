import { useCallback, useState } from "react";
import { Link, useLocation, useNavigate, type To } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { QueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import { AppProviders, TranslationProvider } from "@sito/dashboard-app";

// components
import { SearchModal } from "components";

import { type BasicProviderPropTypes } from "./types";

// lib
import { Manager } from "lib";

import { AuthAccountPersistenceProvider } from "./AuthAccountPersistenceProvider";
import { FeatureFlagsProvider } from "./FeatureFlags/FeatureFlagsProvider";
import { NotificationsProvider } from "./Notifications";
import { OnlineStatusSyncProvider } from "./OnlineStatusSyncProvider";
import { ProfileLanguageSyncProvider } from "./ProfileLanguageSyncProvider";

// config
import { config } from "../config";

export const SitoWalletProvider = ({ children }: BasicProviderPropTypes) => {
  const authConfig = config.auth;

  const { t, i18n } = useTranslation();
  const [manager] = useState(() => new Manager());
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // `offlineFirst` still fires the first attempt while offline, so
            // the request fails and `error` gets populated. With the v5
            // default (`online`) the query stayed paused: no `error`, and
            // `isLoading` false too, which left every screen blank with no
            // message instead of rendering its error state.
            networkMode: "offlineFirst",
            retry: false,
            retryOnMount: false,
            refetchOnMount: true,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
          },
          mutations: {
            // Same reason: a paused mutation keeps `isPending` true forever,
            // so offline submits spun without ever surfacing an error.
            networkMode: "offlineFirst",
          },
        },
      }),
  );
  const navigate = useNavigate();
  const location = useLocation();
  const navigateFn = useCallback(
    (route: string | number) => navigate(route as To),
    [navigate],
  );

  return (
    <AppProviders
      config={{
        location,
        navigate: navigateFn,
        linkComponent: Link,
        searchComponent: SearchModal,
      }}
      manager={{ manager, queryClient }}
      auth={authConfig}
    >
      <TranslationProvider t={t} language={i18n.language}>
        <OnlineStatusSyncProvider>
          <AuthAccountPersistenceProvider>
            <ProfileLanguageSyncProvider>
              <FeatureFlagsProvider>
                <NotificationsProvider>{children}</NotificationsProvider>
              </FeatureFlagsProvider>
            </ProfileLanguageSyncProvider>
          </AuthAccountPersistenceProvider>
        </OnlineStatusSyncProvider>
      </TranslationProvider>
    </AppProviders>
  );
};
