import type { BaseCommonEntityDto } from "@sito/dashboard-app";

export interface CommonSubscriptionProviderDto extends BaseCommonEntityDto {
  name: string;
  image?: string | null;
}
