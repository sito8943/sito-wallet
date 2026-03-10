import { useEffect } from "react";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// lib
import { preloadOfflineBootstrapData } from "lib";

// types
import { BasicProviderPropTypes } from "../types";

// hooks
import { useOnlineStatus } from "hooks";
import { useManager } from "../useSWManager";
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
