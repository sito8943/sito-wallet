import { UseQueryResult, useQuery } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";

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
