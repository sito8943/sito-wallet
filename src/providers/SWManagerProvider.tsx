/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { ManagerProvider } from "@sito/dashboard-app";

// types
import { BasicProviderPropTypes } from "./types";

// lib
import { Manager, OfflineManager } from "lib";

const OfflineManagerContext = createContext<OfflineManager | null>(null);

/**
 * Manager Provider
 * Swaps between online (REST) and offline (IndexedDB) managers reactively.
 * Also exposes the offline manager for seeding IndexedDB after API fetches.
 */
export const SWManagerProvider = (props: BasicProviderPropTypes) => {
  const { children } = props;

  const [onlineManager] = useState(() => new Manager());
  const [offlineManager] = useState(() => new OfflineManager());

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const activeManager = isOnline ? onlineManager : offlineManager;

  return (
    <OfflineManagerContext.Provider value={offlineManager}>
      <ManagerProvider manager={activeManager}>{children}</ManagerProvider>
    </OfflineManagerContext.Provider>
  );
};

export const useOfflineManager = (): OfflineManager => {
  const ctx = useContext(OfflineManagerContext);
  if (!ctx)
    throw new Error(
      "useOfflineManager must be used within SWManagerProvider"
    );
  return ctx;
};
