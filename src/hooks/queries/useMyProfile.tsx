import { UseQueryResult, useQuery } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// types
import type { ProfileDto } from "lib";
import type { UseMyProfileProps } from "./types";

import { ProfileQueryKeys } from "./queryKeys/profileQueryKeys";

export function useMyProfile(
  props: UseMyProfileProps = {},
): UseQueryResult<ProfileDto> {
  const { ensure = false, defaultName = "" } = props;

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...ProfileQueryKeys.me(),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = ensure
          ? await manager.Profiles.ensureMine(defaultName)
          : await manager.Profiles.me();

        offlineManager.Profiles.seed([result]).catch(() => {});
        return result;
      } catch (error) {
        console.warn("API failed, loading profile from IndexedDB", error);
        return ensure
          ? await offlineManager.Profiles.ensureMine(defaultName)
          : await offlineManager.Profiles.me();
      }
    },
  });
}
