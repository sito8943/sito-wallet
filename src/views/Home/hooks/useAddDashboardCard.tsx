import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePostDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { DashboardsQueryKeys } from "hooks";

// utils
import { addEmptyDashboard, formToAddDto } from "../utils";

// lib
import { AddDashboardDto, DashboardDto } from "lib";

// types
import { DashboardFormType } from "../types";

export function useAddDashboardCard() {
  const { t } = useTranslation();

  const manager = useManager();

  const { handleSubmit, ...rest } = usePostDialog<
    AddDashboardDto,
    DashboardDto,
    DashboardFormType
  >({
    formToDto: formToAddDto,
    defaultValues: addEmptyDashboard,
    mutationFn: (data) => manager.Dashboard.insert(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:home.dashboard.addCard.title"),
    ...DashboardsQueryKeys.all(),
  });

  return {
    handleSubmit,
    ...rest,
  };
}
