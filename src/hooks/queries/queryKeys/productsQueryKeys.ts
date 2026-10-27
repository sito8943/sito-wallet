export const ProductsQueryKeys = {
  all: () => ({
    queryKey: ["products"],
  }),
  common: () => ({
    queryKey: [...ProductsQueryKeys.all().queryKey, "common"],
  }),
};
