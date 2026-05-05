import type { AddSubscriptionDto } from "./AddSubscriptionDto";

export interface UpdateSubscriptionDto extends Partial<AddSubscriptionDto> {
  id: number;
  nextRenewalAt?: string | null;
}
