import type { UpdateDashboardCardConfigDto } from "lib";
import type { TypeResumeTypeFormType } from "./types";

export const formToDto = (
  data: TypeResumeTypeFormType,
): UpdateDashboardCardConfigDto => {
  const stringified = JSON.stringify({
    ...data,
  });
  return {
    userId: data.userId,
    id: data.id,
    config: stringified,
  };
};
