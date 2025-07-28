import { useTranslation } from "react-i18next";

// providers
import { useManager } from "providers";

// hooks
import { WalletsQueryKeys, useFormDialog } from "hooks";

// utils
import { dtoToForm, emptyWallet, formToDto } from "../utils";

// types
import { UpdateWalletDto, WalletDto } from "lib";
import { WalletFormType } from "../types";

export function useEditWallet() {
  const { t } = useTranslation();

  const manager = useManager();

  return useFormDialog<WalletDto, UpdateWalletDto, WalletDto, WalletFormType>({
    formToDto,
    dtoToForm,
    defaultValues: emptyWallet,
    getFunction: (id) => manager.Wallets.getById(id),
    mutationFn: (data) => manager.Wallets.update(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:categories.forms.edit"),
    ...WalletsQueryKeys.all(),
  });
}
