import type { AddSubscriptionProviderDto } from "./AddSubscriptionProviderDto";

export interface UpdateSubscriptionProviderDto
  extends Partial<AddSubscriptionProviderDto> {
  id: number;
  name: string;
}
