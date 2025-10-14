import { AuthProvider, NotificationProvider } from "@sito/dashboard-app";

import { type BasicProviderPropTypes } from "./types";

import { SWManagerProvider } from "./SWManagerProvider";
import { LocalCacheProvider } from "./LocalCacheProvider";

// config
import { config } from "../config";

export const SitoWalletProvider = ({ children }: BasicProviderPropTypes) => {
  const authConfig = config.auth;

  return (
    <SWManagerProvider>
      <LocalCacheProvider>
        <NotificationProvider>
          <AuthProvider {...authConfig}>{children}</AuthProvider>
        </NotificationProvider>
      </LocalCacheProvider>
    </SWManagerProvider>
  );
};
