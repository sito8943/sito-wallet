import type { SavingsProjectionDayDto } from "./SavingsProjectionDayDto";

export type SavingsProjectionDailyDto = {
  /** YYYY-MM */
  month: string;
  days: SavingsProjectionDayDto[];
};
