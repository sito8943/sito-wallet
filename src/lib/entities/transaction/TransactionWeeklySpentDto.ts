import { CommonAccountDto } from "lib";

export type TransactionWeeklySpentDto = {
  currentWeek: number;
  previousWeek: number;
  account: CommonAccountDto
};
