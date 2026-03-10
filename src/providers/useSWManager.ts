import { useManager as useBaseManager } from "@sito/dashboard-app";

// lib
import { Manager, OfflineManager } from "lib";
import { useOfflineManager } from "./Offline/OfflineManagerContext";

/**
 * Typed hook that returns the active manager instance (online or offline).
 * Wraps the base `useManager` from `@sito/dashboard-app` and narrows the type.
 */
export function useSWManager(): Manager | OfflineManager {
  return useBaseManager() as Manager | OfflineManager;
}

export const useManager = useSWManager;
export { useOfflineManager };
