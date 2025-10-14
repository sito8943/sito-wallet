import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { TranslationProvider } from "@sito/dashboard";
import { AuthProvider, NotificationProvider } from "@sito/dashboard-app";

import { type BasicProviderPropTypes } from "./types";

import { SWManagerProvider } from "./SWManagerProvider";
import { LocalCacheProvider } from "./LocalCacheProvider";

// config
import { config } from "../config";

export const SitoWalletProvider = ({ children }: BasicProviderPropTypes) => {
  const authConfig = config.auth;

  const { t } = useTranslation();

  return (
    <SWManagerProvider>
      <LocalCacheProvider>
        <TranslationProvider t={t}>
          <NotificationProvider>
            <AuthProvider {...authConfig}>{children}</AuthProvider>
          </NotificationProvider>
        </TranslationProvider>
      </LocalCacheProvider>
    </SWManagerProvider>
  );
};
