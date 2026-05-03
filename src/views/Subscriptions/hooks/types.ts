import type { SubscriptionDto } from "lib";

export interface UseAddSubscriptionBillingLogActionProps {
  onClick: (record: SubscriptionDto) => void;
  hidden?: boolean;
}

export interface UseAddSubscriptionRenewalActionProps {
  onClick: (record: SubscriptionDto) => void;
  hidden?: boolean;
  isLoading?: boolean;
}
