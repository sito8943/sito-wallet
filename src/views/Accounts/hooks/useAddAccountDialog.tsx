import { useTranslation } from "react-i18next";

// providers
import { useManager } from "providers";

// hooks
import { useFormDialog, AccountsQueryKeys } from "hooks";

// utils
import { dtoToForm, emptyAccount, formToDto } from "../utils";

// types
import { AddAccountDto, AccountDto } from "lib";
import { AccountFormType } from "../types";

export function useAddAccountDialog() {
  const { t } = useTranslation();

  const manager = useManager();

  const { handleSubmit, ...rest } = useFormDialog<
    AccountDto,
    AddAccountDto,
    AccountDto,
    AccountFormType
  >({
    formToDto,
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
