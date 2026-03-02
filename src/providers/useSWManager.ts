import { useManager as useBaseManager } from "@sito/dashboard-app";

// lib
import { Manager, OfflineManager } from "lib";

/**
 * Typed hook that returns the active manager instance (online or offline).
 * Wraps the base `useManager` from `@sito/dashboard-app` and narrows the type.
 */
export function useSWManager(): Manager | OfflineManager {
  return useBaseManager() as Manager | OfflineManager;
}

export const useManager = useSWManager;

// Re-export for convenience
export { useOfflineManager } from "./SWManagerProvider";

