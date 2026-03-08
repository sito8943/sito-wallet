import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import {
  AuthProvider,
  NotificationProvider,
  TranslationProvider,
} from "@sito/dashboard-app";

import { type BasicProviderPropTypes } from "./types";

import { SWManagerProvider } from "./SWManagerProvider";
import { OfflineSyncProvider } from "./OfflineSyncProvider";

// config
import { config } from "../config";

export const SitoWalletProvider = ({ children }: BasicProviderPropTypes) => {
  const authConfig = config.auth;

  const { t, i18n } = useTranslation();

  return (
    <SWManagerProvider>
      <TranslationProvider t={t} language={i18n.language}>
        <NotificationProvider>
          <AuthProvider {...authConfig}>
            <OfflineSyncProvider>{children}</OfflineSyncProvider>
          </AuthProvider>
        </NotificationProvider>
      </TranslationProvider>
    </SWManagerProvider>
  );
};
