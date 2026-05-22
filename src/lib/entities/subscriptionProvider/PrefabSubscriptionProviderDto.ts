export interface PrefabSubscriptionProviderDto {
  key: string;
  name: string;
  description: string;
  website: string;
  image: string;
  category: string;
  tags: string[];
  suggestedPrices: Record<string, number>;
  countries: string[];
}
