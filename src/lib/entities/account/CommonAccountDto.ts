import type { BaseCommonEntityDto } from "@sito/dashboard-app";
import type { CommonCurrencyDto } from "lib";
import type { AccountType } from "./AccountType";

export interface CommonAccountDto extends BaseCommonEntityDto {
  name: string;
  currency: CommonCurrencyDto | null;
  /** Sent by the backend so pickers can filter (e.g. Saving accounts only). */
  type?: AccountType;
}
