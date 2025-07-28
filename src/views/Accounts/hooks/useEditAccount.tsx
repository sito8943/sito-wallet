import { useTranslation } from "react-i18next";

// providers
import { useManager } from "providers";

// hooks
import { AccountsQueryKeys, useFormDialog } from "hooks";

// utils
import { dtoToForm, emptyAccount, formToDto } from "../utils";

// types
import { UpdateAccountDto, AccountDto } from "lib";
import { AccountFormType } from "../types";

export function useEditAccount() {
  const { t } = useTranslation();

  const manager = useManager();

  return useFormDialog<AccountDto, UpdateAccountDto, AccountDto, AccountFormType>({
    formToDto,
    dtoToForm,
    defaultValues: emptyAccount,
    getFunction: (id) => manager.Accounts.getById(id),
    mutationFn: (data) => manager.Accounts.update(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:accounts.forms.edit"),
    ...AccountsQueryKeys.all(),
  });
}
