import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePostDialog } from "@sito/dashboard-app";

// providers
import { useManager, useOnboardingDraft } from "providers";

// hooks
import { AccountsQueryKeys } from "hooks";

// utils
import { formToAddDto, addEmptyAccount } from "../utils";

// types
import type { AccountFormType } from "../types";

// lib
import { AccountType } from "lib";
import type { AccountDto, AddAccountDto } from "lib";

export function useAddAccountDialog() {
  const { t } = useTranslation();

  const manager = useManager();
  const { isAnonymous, addAccounts } = useOnboardingDraft();

  const { handleSubmit, ...rest } = usePostDialog<
    AddAccountDto,
    AccountDto,
    AccountFormType
  >({
    formToDto: formToAddDto,
    defaultValues: addEmptyAccount,
    mutationFn: async (data) => {
      if (isAnonymous) {
        const [added] = addAccounts([
          {
            name: data.name,
            balance: data.balance,
            description: data.description,
            type: data.type ?? AccountType.Physical,
            currencyLocalId: data.currencyId,
          },
        ]);
        return {
          id: added.localId,
          name: added.name,
          description: added.description,
          balance: added.balance,
          type: added.type,
          currency: null,
          user: null,
        } as AccountDto;
      }
      return manager.Accounts.insert(data);
    },
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:accounts.forms.add"),
    ...AccountsQueryKeys.all(),
  });

  return {
    handleSubmit,
    ...rest,
  };
}
