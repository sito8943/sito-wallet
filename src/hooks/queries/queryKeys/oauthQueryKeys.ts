export const OAuthQueryKeys = {
  all: () => ({
    queryKey: ["oauth"],
  }),
  request: (id: string) => ({
    queryKey: [...OAuthQueryKeys.all().queryKey, "request", id],
  }),
  grants: () => ({
    queryKey: [...OAuthQueryKeys.all().queryKey, "grants"],
  }),
};
