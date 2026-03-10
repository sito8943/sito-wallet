import { createContext, useContext } from "react";

// lib
import { OfflineManager } from "lib";

export const OfflineManagerContext = createContext<OfflineManager | null>(null);

export const useOfflineManager = (): OfflineManager => {
  const context = useContext(OfflineManagerContext);

  if (!context) {
    throw new Error(
      "useOfflineManager must be used within SWManagerProvider"
    );
  }

  return context;
};
