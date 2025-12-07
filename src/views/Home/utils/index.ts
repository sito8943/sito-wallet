import { DashboardDto, AddDashboardDto, DashboardCardType } from "lib";
import { DashboardFormType } from "../types";

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
