import type { DeleteDto } from "@sito/dashboard-app";
import type { TransactionType } from "./TransactionType";
import type { TransactionProductInputDto } from "./TransactionProductInputDto";

export interface UpdateTransactionDto extends DeleteDto {
  description?: string | null;
  accountId: number;
  categoryIds?: number[];
  categoryId?: number;
  type?: TransactionType;
  amount: number;
  date?: string | null;
  /** Omit to keep the current value; null clears it. */
  purchaseProviderId?: number | null;
  /** Without `purchaseProviderId`: the backend reuses a provider with this name or creates it. */
  purchaseProviderName?: string;
  /** Omit to keep the current lines; [] clears them. */
  products?: TransactionProductInputDto[] | null;
}
