export interface AddGoalDto {
  name: string;
  description?: string | null;
  productId?: number | null;
  /** When set, the backend forces the account currency and ignores `savedAmount`. */
  accountId?: number | null;
  currencyId: number;
  targetAmount: number;
  savedAmount?: number | null;
  /** "YYYY-MM-DD". */
  deadline?: string | null;
}
