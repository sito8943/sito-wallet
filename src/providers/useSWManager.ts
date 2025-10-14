import { useManager as useBaseManager } from "@sito/dashboard-app";

// lib
import { Manager } from "lib";

/**
 * Typed hook that returns the concrete Manager instance.
 * Wraps the base `useManager` from `@sito/dashboard-app` and
 * narrows the type to our local `Manager` implementation.
 */
export function useSWManager(): Manager {
  return useBaseManager() as Manager;
}

// Optional: convenient alias if you prefer importing `useManager` from `providers`.
export const useManager = useSWManager;

