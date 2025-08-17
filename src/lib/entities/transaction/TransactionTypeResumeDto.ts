import { CommonAccountDto } from "lib";

export type TransactionTypeResumeDto = {
  startDate: string;
  endDate: string;
  total: number;
  type: number;
  account: CommonAccountDto;
};
