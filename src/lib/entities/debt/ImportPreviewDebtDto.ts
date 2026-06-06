import type { ImportPreviewDto } from "../ImportPreviewDto";
import type { DebtDirection } from "./DebtDirection";
import type { DebtDto } from "./DebtDto";
import type { DebtStatus } from "./DebtStatus";

export interface ImportPreviewDebtDto
  extends Omit<DebtDto, "direction" | "status">, ImportPreviewDto {
  direction: DebtDirection | number;
  status: DebtStatus | number;
}
