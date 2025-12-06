import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { NotificationProvider, TranslationProvider } from "@sito/dashboard-app";

import { type BasicProviderPropTypes } from "./types";

import { SWManagerProvider } from "./SWManagerProvider";
import { SupabaseAuthProvider } from "./SupabaseAuthProvider";
import { LocalCacheProvider } from "./LocalCacheProvider";

// config
import { config } from "../config";

export const SitoWalletProvider = ({ children }: BasicProviderPropTypes) => {
  const authConfig = config.auth;

  const { t, i18n } = useTranslation();

  return (
    <SWManagerProvider>
      <LocalCacheProvider>
        <TranslationProvider t={t} language={i18n.language}>
          <NotificationProvider>
            <SupabaseAuthProvider {...authConfig}>{children}</SupabaseAuthProvider>
          </NotificationProvider>
        </TranslationProvider>
      </LocalCacheProvider>
    </SWManagerProvider>
  );
};
