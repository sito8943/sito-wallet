import type { CommonPurchaseProviderDto } from "lib";

/** Non-empty photo of the seller, or null when it has none. */
export const getProviderPhoto = (
  purchaseProvider?: CommonPurchaseProviderDto | null,
): string | null => {
  const photo = purchaseProvider?.photo?.trim();
  return photo ? photo : null;
};
