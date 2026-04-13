import type { BaseEntityDto } from "@sito/dashboard-app";

export interface SubscriptionProviderDto extends BaseEntityDto {
  name: string;
  description?: string | null;
  website?: string | null;
  image?: string | null;
  enabled: boolean;
}
