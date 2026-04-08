import { useQuery } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

import { ProfileQueryKeys } from "./queryKeys/profileQueryKeys";

export const useHideDeletedEntitiesPreference = (): boolean => {
  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  const preferenceQuery = useQuery({
    queryKey: [...ProfileQueryKeys.me().queryKey, "hide-deleted-entities"],
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const profile = await manager.Profiles.me();
        offlineManager.Profiles.seed([profile]).catch(() => {});
        return !!profile.hideDeletedEntities;
      } catch (error) {
        console.warn(
          "API failed, loading hideDeletedEntities preference from IndexedDB",
          error,
        );

        const profile = await offlineManager.Profiles.me();
        return !!profile.hideDeletedEntities;
      }
    },
  });

  return !!preferenceQuery.data;
};
