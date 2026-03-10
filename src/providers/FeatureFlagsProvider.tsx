import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAuth } from "@sito/dashboard-app";

import {
  clearPersistedFeatureFlags,
  isFeatureEnabledByDependencies,
  mergeAppFeatures,
  persistFeatureFlags,
  readPersistedFeatureFlags,
} from "lib";

import { config } from "../config";
import { useManager } from "./useSWManager";

import type { FeatureFlagsContextType, BasicProviderPropTypes } from "./types";

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(
  undefined,
);

export const FeatureFlagsProvider = (props: BasicProviderPropTypes) => {
  const { children } = props;

  const manager = useManager();
  const { account } = useAuth();

  const storageKey = config.featureFlags.storageKey;
  const defaults = config.featureFlags.defaults;

  const [features, setFeatures] = useState(() => {
    const persisted = readPersistedFeatureFlags(storageKey);
    return mergeAppFeatures({ defaults, persisted });
  });

  const clearFeatures = useCallback(() => {
    clearPersistedFeatureFlags(storageKey);
    setFeatures(defaults);
  }, [defaults, storageKey]);

  const refreshFeatures = useCallback(async () => {
    const persisted = readPersistedFeatureFlags(storageKey);

    try {
      const payload = await manager.FeatureFlags.getFeatures();
      const nextFeatures = mergeAppFeatures({ defaults, persisted, payload });

      setFeatures(nextFeatures);
      persistFeatureFlags(storageKey, nextFeatures);

      return nextFeatures;
    } catch {
      const fallbackFeatures = mergeAppFeatures({ defaults, persisted });

      setFeatures(fallbackFeatures);
      persistFeatureFlags(storageKey, fallbackFeatures);

      return fallbackFeatures;
    }
  }, [defaults, manager, storageKey]);

  const isFeatureEnabled = useCallback<FeatureFlagsContextType["isFeatureEnabled"]>(
    (key) => isFeatureEnabledByDependencies(features, key),
    [features],
  );

  const previousAccountIdRef = useRef<number | undefined>(account?.id);

  useEffect(() => {
    const previousAccountId = previousAccountIdRef.current;
    const currentAccountId = account?.id;

    if (previousAccountId && !currentAccountId) {
      clearFeatures();
    }

    previousAccountIdRef.current = currentAccountId;
  }, [account?.id, clearFeatures]);

  const value = useMemo(
    () => ({
      features,
      isFeatureEnabled,
      refreshFeatures,
      clearFeatures,
    }),
    [clearFeatures, features, isFeatureEnabled, refreshFeatures],
  );

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export const useFeatureFlags = (): FeatureFlagsContextType => {
  const context = useContext(FeatureFlagsContext);

  if (!context) {
    throw new Error("useFeatureFlags must be used within FeatureFlagsProvider");
  }

  return context;
};
