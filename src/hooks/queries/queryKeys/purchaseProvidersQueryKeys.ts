export const PurchaseProvidersQueryKeys = {
  all: () => ({
    queryKey: ["purchase-providers"],
  }),
  common: () => ({
    queryKey: [...PurchaseProvidersQueryKeys.all().queryKey, "common"],
  }),
};
