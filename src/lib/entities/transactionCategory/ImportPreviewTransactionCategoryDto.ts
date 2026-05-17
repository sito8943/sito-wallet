import type { ImportPreviewDto } from "../ImportPreviewDto";
import type { TransactionCategoryDto } from "./TransactionCategoryDto";

export interface ImportPreviewTransactionCategoryDto
  extends Omit<TransactionCategoryDto, "user">, ImportPreviewDto {}
