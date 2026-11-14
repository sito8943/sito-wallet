import type { BaseEntityDto } from "@sito/dashboard-app";

import type { CommonAccountDto } from "../account";
import type { CommonCurrencyDto } from "../currency";
import type { CommonProductDto } from "../product";
import type { GoalStatus } from "./GoalStatus";

export interface GoalDto extends BaseEntityDto {
  name: string;
  description: string | null;
  status: GoalStatus;
  product: CommonProductDto | null;
  account: CommonAccountDto | null;
  /** Account currency when an account is linked. */
  currency: CommonCurrencyDto;
  targetAmount: number;
  /** Manual amount; ignored when an account is linked. */
  savedAmount: number;
  /** Effective saved amount: account balance or `savedAmount`. */
  saved: number;
  remaining: number;
  /** 0–100, two decimals. */
  progressPercent: number;
  reached: boolean;
  /** "YYYY-MM-DD". */
  deadline: string | null;
  /** Negative when overdue; null without deadline. */
  daysLeft: number | null;
  /** Null without deadline or once reached. */
  monthlyNeeded: number | null;
  completedAt: string | null;
  /** Signed URL: own image, else the product image, else null. */
  photo: string | null;
  hasOwnPhoto: boolean;
}
