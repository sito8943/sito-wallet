import type { BaseCommonEntityDto } from "@sito/dashboard-app";

export interface CommonTransactionDto extends BaseCommonEntityDto {
  description: string | null;
  amount: number;
  date: string | null;
}
