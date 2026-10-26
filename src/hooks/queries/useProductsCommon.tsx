import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import type { CommonProductDto } from "lib";

import { ProductsQueryKeys } from "./queryKeys/productsQueryKeys";

export function useProductsCommon(): UseQueryResult<CommonProductDto[]> {
  const manager = useManager();
  const { account } = useAuth();

  return useQuery({
    ...ProductsQueryKeys.common(),
    enabled: !!account?.id,
    queryFn: () => manager.Products.commonGet({}),
  });
}
