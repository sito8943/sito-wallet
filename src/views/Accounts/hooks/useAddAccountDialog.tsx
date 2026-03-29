import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePostDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { AccountsQueryKeys } from "hooks";

// utils
import { formToAddDto, addEmptyAccount } from "../utils";

// types
import { AccountFormType } from "../types";

// lib
import { AddAccountDto, AccountDto } from "lib";

export function useAddAccountDialog() {
  const { t } = useTranslation();

  const manager = useManager();

  const { handleSubmit, ...rest } = usePostDialog<
    AddAccountDto,
    AccountDto,
    AccountFormType
  >({
    formToDto: formToAddDto,
    defaultValues: addEmptyAccount,
    mutationFn: (data) => manager.Accounts.insert(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:accounts.forms.add"),
    ...AccountsQueryKeys.all(),
  });

  return {
    handleSubmit,
    ...rest,
  };
}
