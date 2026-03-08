import { useEffect } from "react";
import { useAuth } from "@sito/dashboard-app";

import { useOnlineStatus } from "hooks";
import { preloadOfflineBootstrapData } from "lib";

import { BasicProviderPropTypes } from "./types";
import { useManager } from "./useSWManager";
import { useOfflineManager } from "./OfflineManagerContext";

export const OfflineDataPreloadProvider = ({
  children,
}: BasicProviderPropTypes) => {
  const { account, isInGuestMode } = useAuth();
  const isOnline = useOnlineStatus();
  const manager = useManager();
  const offlineManager = useOfflineManager();
  const isGuestMode = isInGuestMode();

  useEffect(() => {
    if (!account?.id || isGuestMode || !isOnline) return;

    void preloadOfflineBootstrapData(manager, offlineManager);
  }, [account?.id, isGuestMode, isOnline, manager, offlineManager]);

  return <>{children}</>;
};
