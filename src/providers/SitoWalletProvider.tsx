import { type ComponentType, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { AppProviders, TranslationProvider } from "@sito/dashboard-app";
import type { BaseLinkPropsType } from "@sito/dashboard-app";

import { type BasicProviderPropTypes } from "./types";

// hooks
import { useOnlineStatus } from "hooks";

// lib
import { Manager, OfflineManager } from "lib";

import { AuthAccountPersistenceProvider } from "./AuthAccountPersistenceProvider";
import { OfflineSyncProvider } from "./Offline/OfflineSyncProvider";
import { FeatureFlagsProvider } from "./FeatureFlags/FeatureFlagsProvider";
import { OfflineManagerProvider } from "./OfflineManagerProvider";
import { navigateWithWindow } from "./navigation";

// config
import { config } from "../config";

export const SitoWalletProvider = ({ children }: BasicProviderPropTypes) => {
  const authConfig = config.auth;

  const { t, i18n } = useTranslation();
  const [onlineManager] = useState(() => new Manager());
  const [offlineManager] = useState(() => new OfflineManager());
  const isOnline = useOnlineStatus();
  const activeManager = isOnline ? onlineManager : offlineManager;

  return (
    <AppProviders
      config={{
        location: window.location,
        navigate: navigateWithWindow,
        linkComponent: Link as unknown as ComponentType<BaseLinkPropsType>,
      }}
      manager={{ manager: activeManager }}
      auth={authConfig}
      appWrapperProvider={{
        provider: OfflineManagerProvider,
        props: { offlineManager },
      }}
    >
      <TranslationProvider t={t} language={i18n.language}>
        <AuthAccountPersistenceProvider>
          <FeatureFlagsProvider>
            <OfflineSyncProvider>{children}</OfflineSyncProvider>
          </FeatureFlagsProvider>
        </AuthAccountPersistenceProvider>
      </TranslationProvider>
    </AppProviders>
  );
};
