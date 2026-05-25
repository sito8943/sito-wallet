import type { ImportPreviewDto } from "../ImportPreviewDto";
import type { SubscriptionBillingUnit } from "./SubscriptionBillingUnit";
import type { SubscriptionDto } from "./SubscriptionDto";
import type { SubscriptionStatus } from "./SubscriptionStatus";

export interface ImportPreviewSubscriptionDto
  extends Omit<SubscriptionDto, "billingUnit" | "status">,
    ImportPreviewDto {
  billingUnit: SubscriptionBillingUnit | number;
  status: SubscriptionStatus | number;
}
