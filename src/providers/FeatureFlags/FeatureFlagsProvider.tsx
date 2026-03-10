import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// lib
import {
  clearPersistedFeatureFlags,
  isFeatureEnabledByDependencies,
  mergeAppFeatures,
  persistFeatureFlags,
  readPersistedFeatureFlags,
} from "lib";

// types
import type { FeatureFlagsContextType } from "./types";
import { BasicProviderPropTypes } from "../types";

// hooks
import { useManager } from "../useSWManager";
import { FeatureFlagsContext } from "./useFeatureFlags";

// config
import { config } from "../../config";

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

  const isFeatureEnabled = useCallback<
    FeatureFlagsContextType["isFeatureEnabled"]
  >((key) => isFeatureEnabledByDependencies(features, key), [features]);

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
