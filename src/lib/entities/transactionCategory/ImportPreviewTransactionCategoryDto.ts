import { ImportPreviewDto } from "../ImportPreviewDto";
import { TransactionCategoryDto } from "./TransactionCategoryDto";

export interface ImportPreviewTransactionCategoryDto
  extends Omit<TransactionCategoryDto, "user">,
    ImportPreviewDto {}

