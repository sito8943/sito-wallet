import type { ImportPreviewDto } from "../ImportPreviewDto";
import type { TransactionDto } from "./TransactionDto";

export interface ImportPreviewTransactionDto
  extends TransactionDto, ImportPreviewDto {}
