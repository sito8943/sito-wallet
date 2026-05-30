import { type ComponentType, useCallback, useState } from "react";
import { Link, useLocation, useNavigate, type To } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { QueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import { AppProviders, TranslationProvider } from "@sito/dashboard-app";
import type { BaseLinkPropsType } from "@sito/dashboard-app";

// components
import { SearchModal } from "components";

import { type BasicProviderPropTypes } from "./types";

// lib
import { Manager } from "lib";

import { AuthAccountPersistenceProvider } from "./AuthAccountPersistenceProvider";
import { FeatureFlagsProvider } from "./FeatureFlags/FeatureFlagsProvider";
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
            retry: false,
            retryOnMount: false,
            refetchOnMount: true,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
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
        linkComponent: Link as unknown as ComponentType<BaseLinkPropsType>,
        searchComponent: SearchModal,
      }}
      manager={{ manager, queryClient }}
      auth={authConfig}
    >
      <TranslationProvider t={t} language={i18n.language}>
        <AuthAccountPersistenceProvider>
          <ProfileLanguageSyncProvider>
            <FeatureFlagsProvider>{children}</FeatureFlagsProvider>
          </ProfileLanguageSyncProvider>
        </AuthAccountPersistenceProvider>
      </TranslationProvider>
    </AppProviders>
  );
};
