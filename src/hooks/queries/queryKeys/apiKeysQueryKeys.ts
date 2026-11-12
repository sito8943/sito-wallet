export const ApiKeysQueryKeys = {
  all: () => ({
    queryKey: ["api-keys"],
  }),
  list: () => ({
    queryKey: [...ApiKeysQueryKeys.all().queryKey, "list"],
  }),
};
