import { useManager as useBaseManager } from "@sito/dashboard-app";

// lib
import { Manager, OfflineManager } from "lib";
import { useOfflineManager } from "./Offline/OfflineManagerContext";

/**
 * Typed hook that returns the active manager instance (online or offline).
 * Wraps the base `useManager` from `@sito/dashboard-app` and narrows the type.
 */
export function useManager(): Manager | OfflineManager {
  return useBaseManager() as Manager | OfflineManager;
}

export { useManager as useSWManager };
export { useOfflineManager };
