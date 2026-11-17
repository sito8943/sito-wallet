import type { CommonPurchaseProviderDto, TransactionType } from "lib";

export type TransactionCardAvatarPropsType = {
  /** Transaction type of the primary category (drives the icon/color). */
  type: TransactionType;
  /** Seller of the transaction; its photo replaces the type icon when set. */
  purchaseProvider?: CommonPurchaseProviderDto | null;
  /** 32px instead of 44px, for dense lists and table cells. */
  compact?: boolean;
};
