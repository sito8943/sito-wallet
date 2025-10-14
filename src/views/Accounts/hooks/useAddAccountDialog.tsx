import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { useFormDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { AccountsQueryKeys } from "hooks";

// utils
import { dtoToForm, emptyAccount, formToAddDto } from "../utils";

// types
import { AccountFormType } from "../types";

// lib
import { AddAccountDto, AccountDto } from "lib";

export function useAddAccountDialog() {
  const { t } = useTranslation();

  const manager = useManager();

  const { handleSubmit, ...rest } = useFormDialog<
    AccountDto,
    AddAccountDto,
    AccountDto,
    AccountFormType
  >({
    formToDto: formToAddDto,
    dtoToForm,
    defaultValues: emptyAccount,
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
