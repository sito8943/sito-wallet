import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// providers
import { useManager } from "providers";

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
  const { account } = useAuth();

  return useQuery({
    ...ProfileQueryKeys.me(),
    enabled: !!account?.id,
    queryFn: () =>
      ensure ? manager.Profiles.ensureMine(defaultName) : manager.Profiles.me(),
  });
}
