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
