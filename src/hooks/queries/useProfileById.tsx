import { UseQueryResult, useQuery } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// types
import type { ProfileDto } from "lib";

import { ProfileQueryKeys } from "./queryKeys/profileQueryKeys";

export function useProfileById(id?: number): UseQueryResult<ProfileDto> {
  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...(id ? ProfileQueryKeys.byId(id) : ProfileQueryKeys.all()),
    enabled: !!account?.id && !!id,
    queryFn: async () => {
      try {
        const result = await manager.Profiles.getById(id as number);

        offlineManager.Profiles.seed([result]).catch(() => {});
        return result;
      } catch (error) {
        console.warn("API failed, loading profile by id from IndexedDB", error);
        return await offlineManager.Profiles.getById(id as number);
      }
    },
  });
}
