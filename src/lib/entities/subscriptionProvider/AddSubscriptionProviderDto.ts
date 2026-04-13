export interface AddSubscriptionProviderDto {
  name: string;
  description?: string | null;
  website?: string | null;
  image?: string | null;
  enabled?: boolean;
}
