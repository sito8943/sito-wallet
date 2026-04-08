import { useSyncExternalStore } from "react";

import { getServerSnapshot, getSnapshot } from "./store";
import { subscribe } from "./subscribe";
import type { OnlineStatusSnapshot } from "./types";

export function useOnlineStatusSnapshot(): OnlineStatusSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
