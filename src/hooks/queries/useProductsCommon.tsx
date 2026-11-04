import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import type { CommonProductDto } from "lib";

import { ProductsQueryKeys } from "./queryKeys/productsQueryKeys";
import { useCatalogSelect } from "./useCatalogSelect";
import type { UseCatalogCommonProps } from "./types";

export function useProductsCommon(
  props: UseCatalogCommonProps = {},
): UseQueryResult<CommonProductDto[]> {
  const { includeShared = false } = props;
  const select = useCatalogSelect<CommonProductDto>(includeShared);
  const manager = useManager();
  const { account } = useAuth();

  return useQuery({
    ...ProductsQueryKeys.common(),
    enabled: !!account?.id,
    queryFn: () => manager.Products.commonGet({}),
    select,
  });
}
