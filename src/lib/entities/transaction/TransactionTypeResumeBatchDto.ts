import type { TransactionType } from "./TransactionType";
import type { TransactionTypeResumeDto } from "./TransactionTypeResumeDto";
import type { TransactionTypeResumeTime } from "./TransactionTypeResumeTime";

export type TransactionTypeResumeBatchRequestItemDto = {
  cardId: number;
  accountId?: number;
  type: TransactionType;
  time: TransactionTypeResumeTime;
  excludedCategoryIds?: number[];
  includeOpposite?: boolean;
  oppositeExcludedCategoryIds?: number[];
};

export type TransactionTypeResumeBatchRequestDto = {
  items: TransactionTypeResumeBatchRequestItemDto[];
};

export type TransactionTypeResumeBatchItemDto = {
  cardId: number;
  primary: TransactionTypeResumeDto;
  opposite?: TransactionTypeResumeDto;
};

export type TransactionTypeResumeBatchDto = {
  items: TransactionTypeResumeBatchItemDto[];
};
