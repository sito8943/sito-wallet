import { UseQueryResult, useQuery } from "@tanstack/react-query";

// providers
import { useManager } from "providers";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// types
import { ProfileDto } from "lib";

type UseMyProfileProps = {
  ensure?: boolean;
  defaultName?: string;
};

export const ProfileQueryKeys = {
  all: () => ({
    queryKey: ["profile"],
  }),
  me: () => ({
    queryKey: [...ProfileQueryKeys.all().queryKey, "me"],
  }),
  byId: (id: number) => ({
    queryKey: [...ProfileQueryKeys.all().queryKey, "by-id", id],
  }),
};

export function useMyProfile(
  props: UseMyProfileProps = {}
): UseQueryResult<ProfileDto> {
  const { ensure = false, defaultName = "" } = props;

  const manager = useManager();
  const { account } = useAuth();

  return useQuery({
    ...ProfileQueryKeys.me(),
    enabled: !!account?.id,
    queryFn: async () =>
      ensure
        ? await manager.Profiles.ensureMine(defaultName)
        : await manager.Profiles.me(),
  });
}

export function useProfileById(id?: number): UseQueryResult<ProfileDto> {
  const manager = useManager();
  const { account } = useAuth();

  return useQuery({
    ...(id ? ProfileQueryKeys.byId(id) : ProfileQueryKeys.all()),
    enabled: !!account?.id && !!id,
    queryFn: async () => await manager.Profiles.getById(id as number),
  });
}
