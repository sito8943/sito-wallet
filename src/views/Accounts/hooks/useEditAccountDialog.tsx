import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { useFormDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { AccountsQueryKeys } from "hooks";

// utils
import { dtoToForm, emptyAccount, formToUpdateDto } from "../utils";

// types
import { AccountFormType } from "../types";

// lib
import { UpdateAccountDto, AccountDto } from "lib";

export function useEditAccountDialog() {
  const { t } = useTranslation();

  const manager = useManager();

  return useFormDialog<
    AccountDto,
    UpdateAccountDto,
    AccountDto,
    AccountFormType
  >({
    formToDto: formToUpdateDto,
    dtoToForm,
    defaultValues: emptyAccount,
    getFunction: (id) => manager.Accounts.getById(id),
    mutationFn: (data) => manager.Accounts.update(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:accounts.forms.edit"),
    ...AccountsQueryKeys.all(),
  });
}
