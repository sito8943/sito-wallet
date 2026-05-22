import { useManager as useBaseManager } from "@sito/dashboard-app";

import type { Manager } from "lib";

export function useManager(): Manager {
  return useBaseManager() as Manager;
}

export { useManager as useSWManager };
