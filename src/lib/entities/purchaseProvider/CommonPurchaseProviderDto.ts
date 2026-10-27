import type { BaseCommonEntityDto } from "@sito/dashboard-app";

export interface CommonPurchaseProviderDto extends BaseCommonEntityDto {
  name: string;
  photo?: string | null;
}
