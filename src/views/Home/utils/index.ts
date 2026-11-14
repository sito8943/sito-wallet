import type { DashboardDto, AddDashboardDto } from "lib";
import { DashboardCardType } from "lib";
import type { DashboardCardFeatures, DashboardFormType } from "../types";

export const formToAddDto = ({
  config,
  ...rest
}: DashboardFormType): AddDashboardDto => ({
  config: config ?? "",
  ...rest,
});

export const dtoToAddForm = (dto: DashboardDto): DashboardFormType => ({
  ...dto,
  userId: dto.user?.id ?? 0,
});

export const addEmptyDashboard: Omit<DashboardFormType, "id"> = {
  type: DashboardCardType.TypeResume,
  config: "",
  position: 0,
  userId: 0,
  title: "",
};

export const emptyDashboard: DashboardFormType = {
  id: 0,
  type: DashboardCardType.TypeResume,
  config: "",
  position: 0,
  userId: 0,
  title: "",
};

export const isDashboardCardEnabled = (
  type: DashboardCardType,
  features: DashboardCardFeatures,
): boolean => {
  if (type === DashboardCardType.WeeklySpent) return false;
  if (type === DashboardCardType.SubscriptionForecast)
    return features.subscriptionsEnabled;
  if (type === DashboardCardType.Goals) return features.goalsEnabled;

  return true;
};
