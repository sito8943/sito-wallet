import { useEffect } from "react";

import { onlineManager } from "@tanstack/react-query";

import { useOnlineStatus } from "hooks";

import type { BasicProviderPropTypes } from "./types";

/**
 * Keeps react-query's `onlineManager` aligned with the app's own connectivity
 * signal. The built-in manager only watches `navigator.onLine`, so a reachable
 * browser talking to an unreachable backend still looked "online" to queries
 * while the offline banner said otherwise.
 */
export const OnlineStatusSyncProvider = ({
  children,
}: BasicProviderPropTypes) => {
  const isOnline = useOnlineStatus();

  useEffect(() => {
    onlineManager.setOnline(isOnline);
  }, [isOnline]);

  return <>{children}</>;
};
