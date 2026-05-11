import type { BasicProviderPropTypes } from "./types";
import { OfflineManagerContext } from "./Offline/OfflineManagerContext";

import type { OfflineManager } from "lib";

type OfflineManagerProviderProps = BasicProviderPropTypes & {
  offlineManager: OfflineManager;
};

export const OfflineManagerProvider = ({
  children,
  offlineManager,
}: OfflineManagerProviderProps) => (
  <OfflineManagerContext.Provider value={offlineManager}>
    {children}
  </OfflineManagerContext.Provider>
);
