import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// types
import type { AccountDto } from "lib";
import type { UseAccountByIdPropsType } from "./types";

// query keys
import { AccountsQueryKeys } from "./queryKeys/accountsQueryKeys";

export function useAccountById(props: UseAccountByIdPropsType) {
  const {
    id,
    includePendingDebts = false,
    includeLastTransactions = false,
  } = props;
  const manager = useManager();
  const { account } = useAuth();
  const query = useMemo(
    () => ({ includePendingDebts, includeLastTransactions }),
    [includeLastTransactions, includePendingDebts],
  );

  return useQuery<AccountDto>({
    ...AccountsQueryKeys.byId(id, query),
    enabled: !!account?.id && !!id,
    queryFn: () => manager.Accounts.getById(id as number, query),
  });
}
