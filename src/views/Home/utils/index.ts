import { DashboardDto, AddDashboardDto, DashboardCardType } from "lib";
import { DashboardFormType } from "../types";

export const formToAddDto = (data: DashboardFormType): AddDashboardDto => ({
  ...data,
});

export const dtoToAddForm = (dto: DashboardDto): DashboardFormType => ({
  ...dto,
  userId: dto.user?.id ?? 0,
});

export const emptyDashboard: DashboardFormType = {
  id: 0,
  type: DashboardCardType.TypeResume,
  config: "",
  position: 0,
  userId: 0,
};
