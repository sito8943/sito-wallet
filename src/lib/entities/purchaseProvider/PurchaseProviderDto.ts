import type { BaseEntityDto } from "@sito/dashboard-app";

export interface PurchaseProviderDto extends BaseEntityDto {
  name: string;
  photo?: string | null;
}
