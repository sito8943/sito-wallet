import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { useAuth, useNotification, usePostDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// components
import { PREFAB_ACCOUNTS } from "components";

// hooks
import { AccountsQueryKeys } from "hooks";

// lib
import { mapAccountType } from "components";
import type { AccountDto, AddAccountDto } from "lib";

// types
import type { PrefabAccountsFormType } from "../types";

export function useAddPrefabAccountsDialog() {
  const { t } = useTranslation();
  const { account } = useAuth();
  const { showErrorNotification } = useNotification();
  const manager = useManager();

  const queryKey = useMemo(() => AccountsQueryKeys.all().queryKey, []);

  const defaultValues = useMemo<PrefabAccountsFormType>(
    () => ({ items: {} }),
    [],
  );

  const { handleSubmit, ...rest } = usePostDialog<
    AddAccountDto[],
    AccountDto,
    PrefabAccountsFormType
  >({
    defaultValues,
    formToDto: (form) =>
      Object.entries(form.items)
        .map(([key, cfg]) => {
          const prefab = PREFAB_ACCOUNTS.find((a) => a.key === key);
          if (!prefab) return null;
          return {
            name: t(`_pages:prefabs.accounts.items.${key}.name`),
            description: "",
            balance: cfg.balance,
            type: mapAccountType(prefab.type),
            currencyId: cfg.currencyId,
            userId: account?.id ?? 0,
          };
        })
        .filter((v): v is AddAccountDto => v !== null),
    mutationFn: (data) => manager.Accounts.insertMany(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:prefabs.dialog.accountsTitle"),
    onError: () =>
      showErrorNotification({ message: t("_accessibility:errors.500") }),
    queryKey,
  });

  return { handleSubmit, ...rest };
}
