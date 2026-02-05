import { ImportPreviewDto } from "../ImportPreviewDto";
import { TransactionDto } from "./TransactionDto";

export interface ImportPreviewTransactionDto
  extends TransactionDto,
    ImportPreviewDto {}

