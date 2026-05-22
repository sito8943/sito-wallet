import { useQuery } from "@tanstack/react-query";

// providers
import { useManager } from "providers";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

import { ProfileQueryKeys } from "./queryKeys/profileQueryKeys";

export const useHideDeletedEntitiesPreference = (): boolean => {
  const manager = useManager();
  const { account } = useAuth();

  const preferenceQuery = useQuery({
    queryKey: [...ProfileQueryKeys.me().queryKey, "hide-deleted-entities"],
    enabled: !!account?.id,
    queryFn: async () => {
      const profile = await manager.Profiles.me();
      return !!profile.hideDeletedEntities;
    },
  });

  return !!preferenceQuery.data;
};
