import type { ImportPreviewDto } from "../ImportPreviewDto";
import type { AccountDto } from "./AccountDto";

export interface ImportPreviewAccountDto
  extends Omit<AccountDto, "user">, ImportPreviewDto {}
