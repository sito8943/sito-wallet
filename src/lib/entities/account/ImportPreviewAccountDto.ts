import { ImportPreviewDto } from "../ImportPreviewDto";
import { AccountDto } from "./AccountDto";

export interface ImportPreviewAccountDto
  extends Omit<AccountDto, "user">,
    ImportPreviewDto {}

