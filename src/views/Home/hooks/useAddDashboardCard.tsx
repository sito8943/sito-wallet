import { useTranslation } from "react-i18next";

// providers
import { useManager } from "providers";

// hooks
import { useFormDialog, CurrenciesQueryKeys } from "hooks";

// utils
import { dtoToAddForm, emptyDashboard, formToAddDto } from "../utils";

// lib
import { AddDashboardDto, DashboardDto } from "lib";

// types
import { DashboardFormType } from "../types";

export function useAddDashboardCard() {
  const { t } = useTranslation();

  const manager = useManager();

  const { handleSubmit, ...rest } = useFormDialog<
    DashboardDto,
    AddDashboardDto,
    DashboardDto,
    DashboardFormType
  >({
    formToDto: formToAddDto,
    dtoToForm: dtoToAddForm,
    defaultValues: emptyDashboard,
    mutationFn: (data) => manager.Dashboard.insert(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:currencies.forms.add"),
    ...CurrenciesQueryKeys.all(),
  });

  return {
    handleSubmit,
    ...rest,
  };
}
