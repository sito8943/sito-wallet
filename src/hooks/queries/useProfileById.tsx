import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// providers
import { useManager } from "providers";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// types
import type { ProfileDto } from "lib";

import { ProfileQueryKeys } from "./queryKeys/profileQueryKeys";

export function useProfileById(id?: number): UseQueryResult<ProfileDto> {
  const manager = useManager();
  const { account } = useAuth();

  return useQuery({
    ...(id ? ProfileQueryKeys.byId(id) : ProfileQueryKeys.all()),
    enabled: !!account?.id && !!id,
    queryFn: () => manager.Profiles.getById(id as number),
  });
}
